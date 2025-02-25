import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Favorite } from '../models/favorite';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  setFavorite(favorite: Favorite): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/favorites`, { ...favorite });
  }

  getFavorite(favorite: Favorite): Observable<Favorite[]> {
    const params = new HttpParams().set('movieId', favorite.movieId).set('user', favorite.user);

    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites`, {
      params: params,
    });
  }

  getAllFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/favorites`);
  }

  deleteFavorite(favorite: Favorite): Observable<Favorite> {  
    console.log('Removido');
    
    const id = favorite['id'];
    
    return this.http.delete<Favorite>(`${this.apiUrl}/favorites/${id}`)
  }
}
