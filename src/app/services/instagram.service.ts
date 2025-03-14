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
  private isProduction = window.location.hostname !== 'localhost';
  
  constructor(private http: HttpClient) { }

  getMedia(limit: number = 9): Observable<InstagramMedia[]> {
    // URL de la fonction Netlify en production, API directe en développement
    const apiUrl = this.isProduction
      ? `/.netlify/functions/instagram?limit=${limit}`
      : `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${environment.instagramToken}&limit=${limit}`;
    
    return this.http.get<any>(apiUrl).pipe(
      map(response => response.data || [])
    );
  }
}