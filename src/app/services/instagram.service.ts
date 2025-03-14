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
  private accessToken = environment.instagramToken;
  private apiUrl = 'https://graph.instagram.com/';
  private fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';

  constructor(private http: HttpClient) { }

  getMedia(limit: number = 9): Observable<InstagramMedia[]> {
    return this.http.get<any>(`${this.apiUrl}me/media?fields=${this.fields}&access_token=${this.accessToken}&limit=${limit}`)
      .pipe(
        map(response => response.data || [])
      );
  }
}