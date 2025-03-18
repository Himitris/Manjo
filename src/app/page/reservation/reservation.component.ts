import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { FirebaseService, CreneauDisponible } from '../../services/firebase.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  providers: [DatePipe]
})
export class ReservationComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  // Formulaires pour chaque étape
  modeFormGroup!: FormGroup;
  dateCreneauFormGroup!: FormGroup;
  infosPersonnellesFormGroup!: FormGroup;

  // Date minimale (demain)
  minDate = new Date();
  
  // Liste des créneaux disponibles
  creneauxDisponibles: CreneauDisponible[] = [];
  
  // État de la soumission
  isSubmitting = false;
  
  // Messages d'erreur
  messageErreurPlaces: string = '';
  messageErreurSoumission: string = '';
  
  // Numéro du restaurant pour le message d'erreur
  numeroRestaurant: string = '+33 5 63 68 25 85';
  
  // ID de la réservation créée
  reservationId = '';
  
  // Flag pour indiquer si une date a été sélectionnée
  dateEstSelectionnee: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private firebaseService: FirebaseService
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
    this.dateCreneauFormGroup.get('nbPersonnes')?.valueChanges.subscribe(this.verifierDisponibilite.bind(this));
    this.dateCreneauFormGroup.get('creneau')?.valueChanges.subscribe(this.verifierDisponibilite.bind(this));

    // Étape 3: Informations personnelles
    this.infosPersonnellesFormGroup = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9+ ]{10,15}$')]]
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
   * Confirmer la réservation
   */
  confirmerReservation(): void {
    if (this.modeFormGroup.invalid || 
        !this.isDateCreneauFormValid() || 
        this.infosPersonnellesFormGroup.invalid) {
      return;
    }

    // Réinitialiser le message d'erreur
    this.messageErreurSoumission = '';
    this.isSubmitting = true;
    
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
      nbPersonnes: nbPersonnes
    };
    
    // Ajouter le créneau uniquement pour le mode "Acheter"
    if (mode === 'acheter') {
      const creneau = this.dateCreneauFormGroup.get('creneau')?.value;
      reservation.heure = creneau.heure;
    }

    this.firebaseService.creerReservation(reservation)
      .then(id => {
        this.reservationId = id;
        this.isSubmitting = false;
        this.stepper.next(); // Passer à l'étape de confirmation
      })
      .catch(error => {
        console.error('Erreur lors de la création de la réservation:', error);
        this.isSubmitting = false;
        
        // Traitement des différentes erreurs possibles
        if (error.message.includes('Plus assez de places disponibles')) {
          // Erreur de disponibilité (uniquement pour le mode "Acheter")
          this.messageErreurSoumission = `Il n'y a plus assez de places disponibles pour ce créneau. Il est possible que quelqu'un vienne de réserver les dernières places. Veuillez sélectionner un autre créneau ou contacter le restaurant au ${this.numeroRestaurant}.`;
          
          // Rafraîchir les créneaux disponibles
          this.firebaseService.getCreneauxDisponibles(dateSelectionnee);
        } else {
          // Autres erreurs
          this.messageErreurSoumission = `Une erreur est survenue lors de votre réservation. Veuillez réessayer ou contacter le restaurant au ${this.numeroRestaurant}.`;
        }
      });
  }

  /**
   * Retourner à la page d'accueil
   */
  retourAccueil(): void {
    this.router.navigate(['/home']);
  }
}