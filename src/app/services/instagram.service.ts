import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  // Détecter l'environnement de production
  private isProduction = window.location.hostname !== 'localhost';
  private netlifyFunctionsAvailable = false; // À définir lors de l'init

  constructor(private http: HttpClient) {
    // Vérifier si nous sommes sur Netlify avec des fonctions disponibles
    // Vous pouvez ajuster cette logique selon votre configuration
    this.netlifyFunctionsAvailable = this.isProduction;
  }

  getMedia(limit: number = 9): Observable<InstagramMedia[]> {
    let apiUrl: string;
    
    if (this.netlifyFunctionsAvailable) {
      // Utiliser la fonction Netlify
      apiUrl = `/.netlify/functions/instagram?limit=${limit}`;
    } else {
      // Appel direct à l'API Instagram (pour le développement)
      apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${environment.instagramToken}&limit=${limit}`;
    }
    
    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        // Gérer à la fois la réponse directe de l'API et celle de notre fonction Netlify
        return response.data || response || [];
      })
    );
  }
}