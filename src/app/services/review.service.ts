import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  public getReviews(movieId: number): Observable<Review[]> {
    const params = new HttpParams().set('movieId', movieId);
    
    return this.http.get<Review[]> (
      `${this.apiURL}/reviews`, {
        params: params
      }
    );
  }

  public sendReview(review: Review): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiURL}/reviews`, {...review});
  }
}
