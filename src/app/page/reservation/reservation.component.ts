import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { FirebaseService, CreneauDisponible } from '../../services/firebase.service';
import { StripeService } from '../../services/stripe.service';
import { StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { take } from 'rxjs/operators';
import { ConditionsGeneralesComponent } from '../conditions-generales/conditions-generales.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  providers: [DatePipe]
})
export class ReservationComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('cardElement') cardElement!: ElementRef;

  // Formulaires pour chaque étape
  modeFormGroup!: FormGroup;
  dateCreneauFormGroup!: FormGroup;
  infosPersonnellesFormGroup!: FormGroup;
  paiementFormGroup!: FormGroup;

  // Date minimale (demain)
  minDate = new Date();

  // Liste des créneaux disponibles
  creneauxDisponibles: CreneauDisponible[] = [];

  // État de la soumission
  isSubmitting = false;
  isProcessingPayment = false;

  // Messages d'erreur
  messageErreurPlaces: string = '';
  messageErreurSoumission: string = '';
  messageErreurPaiement: string = '';

  // Numéro du restaurant pour le message d'erreur
  numeroRestaurant: string = '+33 5 63 68 25 85';

  // ID de la réservation créée
  reservationId = '';

  // Flag pour indiquer si une date a été sélectionnée
  dateEstSelectionnee: boolean = false;

  // Variables pour Stripe
  stripeElements: StripeElements | null = null;
  stripeCard: StripeCardElement | null = null;
  clientSecret: string = '';
  paymentIntentId: string = '';

  // Montants pour les différents types de réservation (en centimes)
  readonly PRIX_PIQUE_NIQUE = 1500;  // 15€ par personne pour un pique-nique acheté
  readonly PRIX_GARDE = 500;         // 5€ par personne pour faire garder son pique-nique

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private firebaseService: FirebaseService,
    private stripeService: StripeService,
    public dialog: MatDialog,
  ) {
    // Définir la date minimale à demain
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.initFormulaires();

    // S'abonner aux changements de créneaux disponibles
    this.firebaseService.creneauxDisponibles$.subscribe(creneaux => {
      this.creneauxDisponibles = creneaux;
      // Revérifier la disponibilité si un créneau est déjà sélectionné
      this.verifierDisponibilite();
    });

    // Observer les changements sur le champ date pour activer/désactiver le sélecteur de créneau
    this.dateCreneauFormGroup.get('date')?.valueChanges.subscribe(date => {
      this.dateEstSelectionnee = !!date;

      // Si la date change, réinitialiser le créneau sélectionné
      if (date) {
        this.dateCreneauFormGroup.get('creneau')?.setValue('');
        // Réinitialiser le message d'erreur
        this.messageErreurPlaces = '';
      }
    });

    // Observer les changements de mode pour ajuster les validateurs
    this.modeFormGroup.get('mode')?.valueChanges.subscribe(mode => {
      this.ajusterValidateurs(mode);
    });
  }

  /**
   * Initialiser les formulaires pour chaque étape
   */
  initFormulaires(): void {
    // Étape 1: Mode de pique-nique
    this.modeFormGroup = this.fb.group({
      mode: ['', Validators.required]
    });

    // Étape 2: Date et créneau
    this.dateCreneauFormGroup = this.fb.group({
      date: ['', Validators.required],
      creneau: [''],  // Validateur ajouté dynamiquement selon le mode
      nbPersonnes: [1, [Validators.required, Validators.min(1), Validators.max(20)]]
    });

    // Surveiller les changements dans le nombre de personnes et le créneau
    this.dateCreneauFormGroup.get('nbPersonnes')?.valueChanges.subscribe(() => {
      this.verifierDisponibilite();
      // Mettre à jour le montant total
      this.calculerMontantTotal();
    });
    this.dateCreneauFormGroup.get('creneau')?.valueChanges.subscribe(this.verifierDisponibilite.bind(this));

    // Étape 3: Informations personnelles
    this.infosPersonnellesFormGroup = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9+ ]{10,15}$')]]
    });

    // Étape 4: Paiement
    this.paiementFormGroup = this.fb.group({
      acceptationCGV: [false, Validators.requiredTrue]
    });
  }

  /**
   * Ajuster les validateurs en fonction du mode choisi
   */
  ajusterValidateurs(mode: string): void {
    const creneauControl = this.dateCreneauFormGroup.get('creneau');

    if (mode === 'acheter') {
      // Pour "Acheter un pique-nique", le créneau est obligatoire
      creneauControl?.setValidators([Validators.required]);
    } else {
      // Pour "Faire garder mon pique-nique", le créneau n'est pas nécessaire
      creneauControl?.clearValidators();
      creneauControl?.setValue(null);
    }

    creneauControl?.updateValueAndValidity();

    // Recalculer le montant total
    this.calculerMontantTotal();
  }

  /**
   * Sélectionner un mode de pique-nique
   */
  selectMode(mode: 'acheter' | 'garder'): void {
    this.modeFormGroup.get('mode')?.setValue(mode);
  }

  /**
   * Vérifier si le mode sélectionné est "Acheter un pique-nique"
   */
  isModePiqueniqueAcheter(): boolean {
    return this.modeFormGroup.get('mode')?.value === 'acheter';
  }

  /**
   * Gérer la sélection d'une date
   */
  onDateSelected(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const dateSelectionnee = this.datePipe.transform(event.value, 'yyyy-MM-dd') || '';

      // Charger les créneaux seulement pour le mode "Acheter"
      if (this.isModePiqueniqueAcheter()) {
        this.firebaseService.getCreneauxDisponibles(dateSelectionnee);
      }

      this.dateEstSelectionnee = true;

      // Réinitialiser le créneau sélectionné
      this.dateCreneauFormGroup.get('creneau')?.setValue('');
      // Réinitialiser le message d'erreur
      this.messageErreurPlaces = '';
    } else {
      this.dateEstSelectionnee = false;
    }
  }

  /**
   * Vérifier si le nombre de personnes sélectionné est compatible avec le créneau
   */
  verifierDisponibilite(): void {
    // Ne vérifier que pour le mode "Acheter"
    if (!this.isModePiqueniqueAcheter()) {
      this.messageErreurPlaces = '';
      return;
    }

    const creneau = this.dateCreneauFormGroup.get('creneau')?.value;
    const nbPersonnes = this.dateCreneauFormGroup.get('nbPersonnes')?.value;

    // Réinitialiser le message d'erreur
    this.messageErreurPlaces = '';

    // Vérifier seulement si on a un créneau et un nombre de personnes valides
    if (creneau && nbPersonnes) {
      if (nbPersonnes > creneau.nbPlacesDisponibles) {
        // Construire le message d'erreur
        this.messageErreurPlaces = `Il n'y a que ${creneau.nbPlacesDisponibles} place(s) disponible(s) pour ce créneau. `;

        // Suggérer d'autres créneaux si possible
        const autresCreneaux = this.creneauxDisponibles.filter(c =>
          c.id !== creneau.id && c.nbPlacesDisponibles >= nbPersonnes
        );

        if (autresCreneaux.length > 0) {
          // Trier les créneaux par heure
          autresCreneaux.sort((a, b) => a.heure.localeCompare(b.heure));

          // Suggérer jusqu'à 3 autres créneaux
          const suggestions = autresCreneaux.slice(0, 3).map(c => c.heure).join(', ');
          this.messageErreurPlaces += `Autres créneaux disponibles: ${suggestions}.`;
        } else {
          // Aucun autre créneau disponible avec assez de places
          this.messageErreurPlaces += `Aucun autre créneau ne dispose de suffisamment de places. Merci de contacter directement le restaurant au ${this.numeroRestaurant}.`;
        }
      }
    }
  }

  /**
   * Vérifier si le formulaire de date/créneau est valide
   */
  isDateCreneauFormValid(): boolean {
    // Pour le mode "Garder", on vérifie uniquement la date et le nombre de personnes
    if (!this.isModePiqueniqueAcheter()) {
      return (this.dateCreneauFormGroup.get('date')?.valid ?? false) &&
        (this.dateCreneauFormGroup.get('nbPersonnes')?.valid ?? false);
    }

    // Pour le mode "Acheter", vérification complète
    const formValide = this.dateCreneauFormGroup.valid && this.messageErreurPlaces === '';

    // Vérification supplémentaire de la disponibilité au moment de valider
    if (formValide) {
      const creneau = this.dateCreneauFormGroup.get('creneau')?.value;
      const nbPersonnes = this.dateCreneauFormGroup.get('nbPersonnes')?.value;

      if (creneau && nbPersonnes > creneau.nbPlacesDisponibles) {
        this.verifierDisponibilite(); // Mettre à jour le message d'erreur
        return false;
      }
    }

    return formValide;
  }

  /**
   * Formater une date pour l'affichage
   */
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  /**
   * Calculer le montant total à payer
   */
  calculerMontantTotal(): number {
    const mode = this.modeFormGroup.get('mode')?.value;
    const nbPersonnes = this.dateCreneauFormGroup.get('nbPersonnes')?.value || 0;

    let montant = 0;

    if (mode === 'acheter') {
      montant = nbPersonnes * this.PRIX_PIQUE_NIQUE;
    } else if (mode === 'garder') {
      montant = nbPersonnes * this.PRIX_GARDE;
    }

    return montant;
  }

  /**
 * Ouvre la modal des conditions générales de vente
 */
  ouvrirConditionsGenerales(): void {
    const dialogRef = this.dialog.open(ConditionsGeneralesComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'terms-dialog',
    });
  }

  /**
   * Obtenir le montant formaté pour l'affichage
   */
  getMontantFormate(): string {
    const montant = this.calculerMontantTotal() / 100;
    return montant.toFixed(2).replace('.', ',') + ' €';
  }

  /**
   * Initialise les éléments Stripe et crée un PaymentIntent
   */
  async preparerPaiement(): Promise<void> {
    if (!this.isDateCreneauFormValid() || this.infosPersonnellesFormGroup.invalid) {
      return;
    }

    this.messageErreurPaiement = '';
    this.isSubmitting = true;

    try {
      // 1. Calculer le montant total
      const montant = this.calculerMontantTotal();

      // Vérifier que le montant est supérieur à zéro
      if (montant <= 0) {
        throw new Error('Le montant du paiement est invalide.');
      }

      // 2. Créer une intention de paiement
      const mode = this.modeFormGroup.get('mode')?.value;
      const nbPersonnes = this.dateCreneauFormGroup.get('nbPersonnes')?.value;
      const dateSelectionnee = this.datePipe.transform(this.dateCreneauFormGroup.get('date')?.value, 'yyyy-MM-dd') || '';

      // Obtenir un PaymentIntent
      const response = await this.stripeService.createPaymentIntent({
        amount: montant,
        currency: 'eur',
        description: `Réservation pique-nique ${mode} - ${nbPersonnes} personne(s) - ${dateSelectionnee}`,
        metadata: {
          mode,
          nbPersonnes: nbPersonnes.toString(),
          date: dateSelectionnee,
          email: this.infosPersonnellesFormGroup.get('email')?.value,
          nom: `${this.infosPersonnellesFormGroup.get('prenom')?.value} ${this.infosPersonnellesFormGroup.get('nom')?.value}`
        }
      }).pipe(take(1)).toPromise();

      // Stocker le client_secret et l'ID du PaymentIntent
      if (response) {
        this.clientSecret = response.clientSecret;
        this.paymentIntentId = response.id;
      } else {
        throw new Error('Failed to create PaymentIntent.');
      }

      // 3. Initialiser les éléments Stripe
      this.stripeElements = await this.stripeService.initStripeElements(this.clientSecret);

      // 4. Attendre que le DOM soit prêt
      setTimeout(async () => {
        // 5. Créer l'élément de carte
        if (this.stripeElements && this.cardElement) {
          this.stripeCard = await this.stripeService.createCardElement(
            this.stripeElements,
            'card-element'
          );

          // Gérer les erreurs de l'élément carte
          this.stripeCard.on('change', (event) => {
            if (event.error) {
              this.messageErreurPaiement = event.error.message || 'Une erreur est survenue.';
            } else {
              this.messageErreurPaiement = '';
            }
          });
        }

        this.isSubmitting = false;
      }, 100);

    } catch (error: any) {
      console.error('Erreur lors de la préparation du paiement:', error);
      this.messageErreurPaiement = error.message || 'Une erreur est survenue lors de la préparation du paiement.';
      this.isSubmitting = false;
    }
  }

  /**
   * Traiter le paiement et confirmer la réservation
   */
  async confirmerPaiement(): Promise<void> {
    if (!this.clientSecret || !this.stripeCard || this.paiementFormGroup.invalid) {
      return;
    }

    this.isProcessingPayment = true;
    this.messageErreurPaiement = '';

    try {
      // Récupérer les informations du client
      const nom = `${this.infosPersonnellesFormGroup.get('prenom')?.value} ${this.infosPersonnellesFormGroup.get('nom')?.value}`;
      const email = this.infosPersonnellesFormGroup.get('email')?.value;
      const telephone = this.infosPersonnellesFormGroup.get('telephone')?.value;

      // Confirmer le paiement
      const result = await this.stripeService.confirmPayment(this.clientSecret, {
        name: nom,
        email,
        phone: telephone
      });

      if (!result.success) {
        throw new Error(result.error || 'Le paiement a échoué.');
      }

      // Si le paiement a réussi, créer la réservation
      await this.creerReservation();

    } catch (error: any) {
      console.error('Erreur lors du paiement:', error);
      this.messageErreurPaiement = error.message || 'Une erreur est survenue lors du paiement.';
      this.isProcessingPayment = false;
    }
  }

  /**
   * Créer la réservation dans Firebase après confirmation du paiement
   */
  async creerReservation(): Promise<void> {
    try {
      const mode = this.modeFormGroup.get('mode')?.value;
      const dateSelectionnee = this.datePipe.transform(this.dateCreneauFormGroup.get('date')?.value, 'yyyy-MM-dd') || '';
      const nbPersonnes = this.dateCreneauFormGroup.get('nbPersonnes')?.value;

      // Base de la réservation
      const reservation: any = {
        nom: this.infosPersonnellesFormGroup.get('nom')?.value,
        prenom: this.infosPersonnellesFormGroup.get('prenom')?.value,
        email: this.infosPersonnellesFormGroup.get('email')?.value,
        telephone: this.infosPersonnellesFormGroup.get('telephone')?.value,
        date: dateSelectionnee,
        mode: mode,
        nbPersonnes: nbPersonnes,
        montantPaye: this.calculerMontantTotal() / 100, // En euros
        paymentIntentId: this.paymentIntentId
      };

      // Ajouter le créneau uniquement pour le mode "Acheter"
      if (mode === 'acheter') {
        const creneau = this.dateCreneauFormGroup.get('creneau')?.value;
        reservation.heure = creneau.heure;
      }

      const id = await this.firebaseService.creerReservation(reservation);
      this.reservationId = id;
      this.isProcessingPayment = false;
      this.stepper.next(); // Passer à l'étape de confirmation

    } catch (error: any) {
      console.error('Erreur lors de la création de la réservation:', error);

      this.messageErreurPaiement = `Le paiement a été effectué, mais l'enregistrement de la réservation a échoué. 
        Veuillez contacter le restaurant au ${this.numeroRestaurant} en indiquant la référence de paiement: ${this.paymentIntentId}`;

      this.isProcessingPayment = false;
    }
  }

  /**
   * Retourner à la page d'accueil
   */
  retourAccueil(): void {
    this.router.navigate(['/home']);
  }
}