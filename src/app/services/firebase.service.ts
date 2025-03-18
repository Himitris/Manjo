import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc, getDocs, addDoc,
  query, where, updateDoc, Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces pour les données de Firestore
export interface CreneauDisponible {
  date: string;
  heure: string;
  nbPlacesDisponibles: number;
  id?: string;
}

export interface Reservation {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date: string;
  heure?: string;
  mode: 'acheter' | 'garder';
  nbPersonnes: number;
  createdAt?: any;
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: Firestore;
  private firebaseConfig = {
    apiKey: environment.firebase.apiKey,
    authDomain: environment.firebase.authDomain,
    projectId: environment.firebase.projectId,
    storageBucket: environment.firebase.storageBucket,
    messagingSenderId: environment.firebase.messagingSenderId,
    appId: environment.firebase.appId
  };

  private _creneauxDisponibles = new BehaviorSubject<CreneauDisponible[]>([]);
  creneauxDisponibles$ = this._creneauxDisponibles.asObservable();

  constructor() {
    const app = initializeApp(this.firebaseConfig);
    this.db = getFirestore(app);
  }

  /**
   * Récupérer les créneaux disponibles pour une date donnée
   */
  async getCreneauxDisponibles(dateSelectionnee: string): Promise<void> {
    try {
      const creneauxRef = collection(this.db, 'creneaux');
      const q = query(creneauxRef, where("date", "==", dateSelectionnee));
      const querySnapshot = await getDocs(q);

      const creneaux: CreneauDisponible[] = [];
      querySnapshot.forEach((doc) => {
        creneaux.push({
          id: doc.id,
          ...doc.data() as CreneauDisponible
        });
      });

      // Si aucun créneau n'existe pour cette date, les créer
      if (creneaux.length === 0) {
        await this.initialiserCreneauxPourDate(dateSelectionnee);
        return this.getCreneauxDisponibles(dateSelectionnee);
      }

      // Trier les créneaux par heure
      creneaux.sort((a, b) => a.heure.localeCompare(b.heure));

      this._creneauxDisponibles.next(creneaux);
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux:", error);
      throw error;
    }
  }

  /**
   * Initialiser les créneaux par défaut pour une date
   */
  private async initialiserCreneauxPourDate(date: string): Promise<void> {
    const creneauxRef = collection(this.db, 'creneaux');
    const creneauxHeures = [
      "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"
    ];

    try {
      for (const heure of creneauxHeures) {
        await addDoc(creneauxRef, {
          date,
          heure,
          nbPlacesDisponibles: 20 // 20 repas max par créneau
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des créneaux:", error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle réservation
   */
  async creerReservation(reservation: Reservation): Promise<string> {
    try {
      // Pour le mode "acheter", vérifier la disponibilité du créneau
      if (reservation.mode === 'acheter' && reservation.heure) {
        // 1. Vérifier si le créneau est disponible
        const creneauxRef = collection(this.db, 'creneaux');
        const q = query(
          creneauxRef,
          where("date", "==", reservation.date),
          where("heure", "==", reservation.heure)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Créneau non disponible");
        }

        const creneauDoc = querySnapshot.docs[0];
        const creneauData = creneauDoc.data() as CreneauDisponible;

        // Vérifier s'il reste assez de places
        if (creneauData.nbPlacesDisponibles < reservation.nbPersonnes) {
          throw new Error("Plus assez de places disponibles sur ce créneau");
        }

        // 2. Mettre à jour le créneau avec les places restantes
        await updateDoc(doc(this.db, 'creneaux', creneauDoc.id), {
          nbPlacesDisponibles: creneauData.nbPlacesDisponibles - reservation.nbPersonnes
        });
      }

      // 3. Créer la réservation
      const reservationRef = collection(this.db, 'reservations');
      const docRef = await addDoc(reservationRef, {
        ...reservation,
        createdAt: serverTimestamp()
      });

      // Rafraîchir les créneaux si nécessaire
      if (reservation.mode === 'acheter') {
        await this.getCreneauxDisponibles(reservation.date);
      }

      return docRef.id;
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      throw error;
    }
  }

  /**
   * Vérifie si une date est disponible pour réservation
   * (au moins un jour à l'avance et doit être dans le futur)
   */
  isDateReservable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return date >= tomorrow;
  }
}