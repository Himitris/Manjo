import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: Promise<Stripe | null>;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;
  
  // Détecter l'environnement de production
  private isProduction = window.location.hostname !== 'localhost';
  private netlifyFunctionsAvailable = false;

  constructor(private http: HttpClient) {
    // Initialiser Stripe avec la clé publique
    this.stripe = loadStripe(environment.stripePublicKey);
    
    // Vérifier si nous sommes sur Netlify avec des fonctions disponibles
    this.netlifyFunctionsAvailable = this.isProduction;
  }

  /**
   * Crée un PaymentIntent sur le serveur
   */
  createPaymentIntent(paymentData: PaymentData): Observable<PaymentIntentResponse> {
    let apiUrl: string;
    
    if (this.netlifyFunctionsAvailable) {
      // Utiliser la fonction Netlify
      apiUrl = '/.netlify/functions/create-payment-intent';
    } else {
      // Pour le développement local
      apiUrl = 'http://localhost:8888/.netlify/functions/create-payment-intent';
    }
    return this.http.post<PaymentIntentResponse>(apiUrl, paymentData).pipe(
      catchError(error => {
        console.error('Error creating payment intent:', error);
        return throwError(() => new Error('Impossible de créer l\'intention de paiement. Veuillez réessayer.'));
      })
    );
  }

  /**
   * Initialise les éléments Stripe pour le formulaire de carte
   */
  async initStripeElements(clientSecret: string): Promise<StripeElements> {
    const stripeInstance = await this.stripe;
    
    if (!stripeInstance) {
      throw new Error('Stripe n\'a pas pu être initialisé.');
    }
    
    this.elements = stripeInstance.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#5d7052', // $forest-green
          colorBackground: '#f8f5f0', // $background-color
          colorText: '#6a645a', // $dark-gray
          colorDanger: '#c18845', // $rusty-orange
          fontFamily: 'Poppins, sans-serif',
          borderRadius: '8px',
        }
      }
    });
    
    return this.elements;
  }

  /**
   * Crée un élément de carte
   */
  async createCardElement(elements: StripeElements, elementId: string): Promise<StripeCardElement> {
    const cardElement = elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          fontSize: '16px',
          '::placeholder': {
            color: '#999999',
          },
        },
      },
    });
    
    cardElement.mount(`#${elementId}`);
    this.card = cardElement;
    
    return cardElement;
  }

  /**
   * Confirme le paiement avec les détails de la carte
   */
  async confirmPayment(clientSecret: string, paymentData: {
    name: string,
    email: string,
    phone?: string
  }): Promise<{success: boolean, error?: string}> {
    const stripeInstance = await this.stripe;
    
    if (!stripeInstance || !this.card) {
      throw new Error('Stripe ou l\'élément de carte n\'est pas initialisé.');
    }
    
    try {
      const result = await stripeInstance.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: paymentData.name,
            email: paymentData.email,
            phone: paymentData.phone
          }
        }
      });
      
      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Une erreur est survenue lors du paiement.'
        };
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Le paiement n\'a pas pu être complété. Veuillez réessayer.'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Une erreur inattendue est survenue.'
      };
    }
  }
}