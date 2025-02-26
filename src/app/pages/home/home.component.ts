import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { MovieService } from '../../services/movie.service';
import { FavoriteService } from '../../services/favorite.service';
import { Subscription } from 'rxjs';
import { Favorite } from '../../models/favorite';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/language';
import { Movie } from '../../models/movies';
import { CardMovieComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    CommonButtonComponent,
    CardMovieComponent,
    CommonModule,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  movieSubscription = new Subscription();
  favoriteSubscription = new Subscription();
  languageSubscription = new Subscription();
  movieImageUrl: string = 'https://image.tmdb.org/t/p/w500/';
  movies: Movie[] = [];
  favoritesMovies: Favorite[] = [];
  popularMovies: Movie[] = [];
  language!: Language;
  carouselMin: number = 0;
  carouselMinPopular: number = 0;
  carouselMax: number = 4;
  carouselMaxPopular: number = 4;

  constructor(
    private movieService: MovieService,
    private favoriteService: FavoriteService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguage().subscribe({
      next: (language) => {
        this.language = language;
        this.getFavorites(true);
      },
      error: (err) => console.error(err),
    });
  }

  getFavorites(restart = false) {
    this.favoriteSubscription = this.favoriteService
      .getAllFavorites()
      .subscribe({
        next: (favorite) => {
          if (restart) {
            this.favoritesMovies = [];
            this.movies = [];
          }
          this.favoritesMovies = favorite;
          this.getToFavoritesMovies();
          this.getPopularMovies();

        },
        error: (err) => console.error(err),
      });
  }

  getToFavoritesMovies() {
    for (let favorite of this.favoritesMovies) {
      this.movieSubscription = this.movieService
        .getDetailsMovies(favorite.movieId, this.language.code)
        .subscribe({
          next: (movie) => {
            movie.poster_path_complete = this.movieImageUrl + movie.poster_path;
            if (this.movies.length != 0) {
              this.movies = [...this.movies, movie];
            } else {
              this.movies = [movie];
            }
          },
          error: (err) => console.error(err),
        });
    }
  }

  isMovieInFavorites(movieId: number): boolean {
    const movie = this.favoritesMovies.find(
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
            if (favorite[0] && favorite[0].id) {
              console.log('Removido: ', favorite);

              this.favoriteService.deleteFavorite(favorite[0]).subscribe({
                next: (favorite) => {
                  console.log(this.favoritesMovies);

                  this.movies.filter((movie) => {
                    if (movie.id == favorite.movieId) {
                      let index = this.movies.indexOf(movie);

                      this.movies.splice(index, 1);
                    }
                  });
                  this.favoritesMovies.filter((favoriteSearch) => {
                    if (favoriteSearch.id == favorite.id) {
                      let indexFavorite =
                        this.favoritesMovies.indexOf(favoriteSearch);
                      this.favoritesMovies.splice(indexFavorite, 1);
                    }
                  });

                  this.restartCarousel();
                },
              });
            }
          },
          error: (err) => console.error(err),
        });
    }
  }

  getPopularMovies() {
    this.movieService
    .getPopularMovies(this.carouselMaxPopular, this.language.code)
    .subscribe({
      next: (popular) => {
        if(this.popularMovies) {
          this.popularMovies = [
            ...this.popularMovies,
            ...popular.results.map((movie: Movie) => ({
              ...movie,
              poster_path_complete: this.movieImageUrl + movie.poster_path,
            })),
          ];
        } else {
          this.popularMovies = [
            ...popular.results.map((movie: Movie) => ({
              ...movie,
              poster_path_complete: this.movieImageUrl + movie.poster_path,
            })),
          ];
        }

      },
      error: (err) => console.error(err),
    });
  }

  prevCarousel() {
    this.carouselMin -= 4;
    this.carouselMax -= 4;
  }

  prevCarouselPopular() {
    this.carouselMinPopular -= 4;
    this.carouselMaxPopular -= 4;
  }

  nextCarousel() {
    this.carouselMin += 4;
    this.carouselMax += 4;
  }

  nextCarouselPopular() {
    this.carouselMinPopular += 4;
    this.carouselMaxPopular += 4;
    this.getPopularMovies();
  }

  restartCarousel() {
    this.carouselMax = 4;
    this.carouselMaxPopular = 4;
    this.carouselMin = 0;
    this.carouselMaxPopular = 4;
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
    this.favoriteSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }
}
