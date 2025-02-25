import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { Movie } from '../../models/movies';
import { CardMovieComponent } from '../../components/movie-card/movie-card.component';
import { Subscription } from 'rxjs';
import { Language } from '../../models/language';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../models/favorite';

@Component({
  selector: 'app-movies',
  imports: [
    CommonModule,
    FormsModule,
    CommonButtonComponent,
    CardMovieComponent,
    TranslateModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
})
export class MoviesComponent implements OnInit, OnDestroy {
  subscriptionMovies = new Subscription();
  subscriptionLanguage = new Subscription();
  movies: Movie[] = [];
  moviesSearch: Movie[] = [];
  moviesFavorites: Favorite[] = [];
  numberMoviesDisplayed!: number;
  numberMoviesPerPage: number = 1;
  searchText: string = '';
  movieImageUrl: string = 'https://image.tmdb.org/t/p/w500/';
  language!: Language;
  languages!: Language[];
  apiNotWorking: boolean = false;
  apiFailAlert: boolean = false;

  constructor(
    private moviesService: MovieService,
    private languageService: LanguageService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.subscriptionLanguage = this.languageService.getLanguage().subscribe({
      next: (language) => {
        this.language = language;
        this.numberMoviesPerPage = 1;
        this.getFavoriteMovies();
      },
    });
    this.languages = this.languageService.getAllLanguages();
  }

  ngOnDestroy(): void {
    this.subscriptionMovies.unsubscribe();
  }

  getMovies(restart: boolean = false) {
    this.subscriptionMovies = this.moviesService
      .getPopularMovies(this.numberMoviesPerPage, this.language.code)
      .subscribe({
        next: (res) => {
          if (!restart) {
            this.movies = [
              ...this.movies,
              ...res.results.map((movie: Movie) => ({
                ...movie,
                poster_path_complete: this.movieImageUrl + movie.poster_path,
              })),
            ];
          } else {
            this.movies = [
              ...res.results.map((movie: Movie) => ({
                ...movie,
                poster_path_complete: this.movieImageUrl + movie.poster_path,
              })),
            ];
          }

          this.getNumberMoviesDisplayed();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  searchMovie() {
    let moviesCopy: Movie[] = [...this.movies];

    if (this.searchText) {
      this.moviesSearch = [];
      moviesCopy.filter((movie) => {
        if (movie.title.toLowerCase().includes(this.searchText.toLowerCase())) {
          this.moviesSearch.push(movie);
        }
      });

      this.numberMoviesDisplayed = this.moviesSearch.length;
    } else {
      this.moviesSearch = [];
      this.getNumberMoviesDisplayed();
    }
  }

  seeMore() {
    this.numberMoviesPerPage++;
    this.getMovies();
  }

  getNumberMoviesDisplayed() {
    this.numberMoviesDisplayed = this.movies.length;
  }

  getFavoriteMovies() {
    this.favoriteService.getAllFavorites().subscribe({
      next: (favorites) => {
        this.moviesFavorites = favorites;
        this.getMovies(true);
      },
      error: (err) => {
        this.apiNotWorking = true;
        this.getMovies(true);
      },
    });
  }

  isMovieInFavorites(movieId: number): boolean {
    const movie = this.moviesFavorites.find(
      (movie) => movie.movieId === movieId
    );

    if (movie) {
      return true;
    }
    return false;
  }

  toggleFavorite(movieId: number, liked: boolean) {
    let user = 'Grogu';

    const movie = this.movies.find((movie) => movie.id === movieId);
    if (movie) {
      this.favoriteService
        .getFavorite({ movieId: movieId, user: user })
        .subscribe({
          next: (favorite) => {
            if (liked) {
              this.favoriteService
                .setFavorite({ movieId: movieId, user: user })
                .subscribe();
            } else {
               if (favorite[0] && favorite[0].id) {
                this.favoriteService.deleteFavorite(favorite[0]).subscribe();
              }
            }
          },
          error: (err) => {
            console.log('aqui');
            if(!this.apiFailAlert) {
              this.apiFailAlert = true;
            }
          },
        });
    }
  }
}
