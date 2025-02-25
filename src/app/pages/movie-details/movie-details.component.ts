import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../models/movies';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../../components/modal/modal.component';
import { MovieService } from '../../services/movie.service';
import { CreditService } from '../../services/credit.service';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Review } from '../../models/review';
import { ReviewService } from '../../services/review.service';
import { RatingStarComponent } from '../../components/rating-star/rating-star.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-movie-details',
  imports: [
    AvatarComponent,
    CommonButtonComponent,
    CommonModule,
    FormsModule,
    BadgeComponent,
    DatePipe,
    DecimalPipe,
    ModalComponent,
    ReactiveFormsModule,
    RatingStarComponent,
    TranslateModule
  ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  idMovie: number = 0;
  subscriptionMovie = new Subscription();
  subscriptionCast = new Subscription();
  subscriptionReview = new Subscription();
  subscriptionLanguage = new Subscription();
  movie: Movie = {} as Movie;
  movieImageUrl: string = 'https://image.tmdb.org/t/p/w500/';
  language!: Language;
  reviews!: Review[];
  reviewForms: FormGroup;
  rating!: number;
  submitNotValid: boolean = false;
  submited: boolean = false;
  submitRequestFail: boolean = false;

  constructor(
    private moviesService: MovieService,
    private castService: CreditService,
    private languageService: LanguageService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reviewForms = new FormGroup({
      rating: new FormControl(null, [Validators.required]),
      watchedDate: new FormControl('', [Validators.required]),
      reviewContent: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.idMovie = Number(this.route.snapshot.paramMap.get('id'));
    this.subscriptionLanguage = this.languageService.getLanguage().subscribe({
      next: (language) => {
        this.language = language;
        this.getMovieDetails();
      },
    });
    this.getMovieDetails();
  }

  getMovieDetails() {
    this.subscriptionMovie = this.moviesService
      .getDetailsMovies(this.idMovie, this.language.code)
      .subscribe({
        next: (res) => {
          this.movie = {
            ...res,
            poster_path_complete: this.movieImageUrl + res.poster_path,
          };
          this.getCastAndCrewDetails();
          this.getReviews(this.idMovie);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCastAndCrewDetails() {
    this.subscriptionCast = this.castService
      .getCast(this.idMovie, this.language.code)
      .subscribe({
        next: (res) => {
          const directors = res.crew.filter(
            (crew) => crew['job'] == 'Director'
          );

          this.movie = {
            ...this.movie,
            crew: directors.map((director) => ({
              ...director,
              profile_path_complete:
                this.movieImageUrl + director['profile_path'],
            })),
            cast: res.cast.map((actor) => ({
              ...actor,
              profile_path_complete: this.movieImageUrl + actor['profile_path'],
            })),
          };
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getReviews(movieId: number) {
    this.subscriptionReview = this.reviewService.getReviews(movieId).subscribe({
      next: (res) => {
        this.reviews = [...res];
      },
      error: (err) => console.log(err),
    });
  }

  getCurrentDateWithTime() {
    return new Date().toISOString();
  }


  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmitReview() {
    console.log(this.reviewForms.get('rating'));
    console.log(this.reviewForms.get('rating')?.valid);
    
    if (!this.reviewForms.invalid) {
      this.reviewService
        .sendReview({
          movieId: this.movie['id'],
          author: 'Grogu',
          rating: this.reviewForms.get('rating')?.value,
          reviewDate: this.getCurrentDateWithTime(),
          reviewContent: this.reviewForms.get('reviewContent')?.value,
          watchedDate: this.reviewForms.get('watchedDate')?.value,
        })
        .subscribe({
          next: (response) => {
            this.submitNotValid = false;
            this.submited = true;
            this.getReviews(this.movie['id']);
            this.reviewForms.reset();
          },
          error: (err) => {console.error(err);
            this.submitRequestFail = true;
          },
        });
    } else {
      this.submitNotValid = true;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionMovie.unsubscribe();
    this.subscriptionCast.unsubscribe();
    this.subscriptionReview.unsubscribe();
  }
}
