import { Injectable, OnInit } from '@angular/core';
import { Movie } from '../models/movies';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  moviesList: Movie[] = [];
  moviesDisplay: Movie[] = [];

  private apiURL = 'https://api.themoviedb.org/3/movie';

  private defaultHeaders = {
    Authorization: 'Bearer ' + environment.apiKey,
  }

  constructor(private http: HttpClient) { }

  public getPopularMovies(
    page: number,
    language: string
  ): Observable<{results: []}> {
    const params = new HttpParams()
      .set('language', language)
      .set('page', page);

    return this.http.get<{results: []}>(`${this.apiURL}/top_rated`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getDetailsMovies(id: number, language: string): Observable<Movie> {
    const params = new HttpParams().set('language', language);

    return this.http.get<Movie>(`${this.apiURL}/${id}`, {
      params: params,
      headers: this.defaultHeaders,
    })
  }

}
