import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cast } from '../models/cast';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiURL = 'https://api.themoviedb.org/3/movie';

  private defaultHeaders = {
    Authorization: 'Bearer ' + environment.apiKey,
  }

  constructor(private http: HttpClient) { }
  
  getCast(idMovie: number, language: string): Observable<{cast: Cast[], crew: Cast[]}> {
    const params = new HttpParams().set('language', language);
    return this.http.get<{cast: [], crew: Cast[]}>(`${this.apiURL}/${idMovie}/credits`, {
      params: params,
      headers: this.defaultHeaders,
    })
  }
}
