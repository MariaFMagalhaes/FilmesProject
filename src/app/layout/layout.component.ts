import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SideNavComponent } from '../components/sidenav/sidenav.component';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { LanguageService } from '../services/language.service';
import { Language } from '../models/language';
import { Subscription } from 'rxjs';
import { Breadcrumb } from '../models/breadcrumb';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movies';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SideNavComponent, BreadcrumbComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  languages!: Language[];
  language!: Language;
  breadcrumb: Breadcrumb[] = [];
  movieTitle!: string;
  movieId!: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private movieService: MovieService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.subscription = this.languageService
      .getLanguage()
      .subscribe((language) => {
        this.language = language;
        this.translate.use(language.code);
        if (this.breadcrumb) {
          this.updateBreadcrumb();
        }
      });

    this.languages = this.languageService.getAllLanguages();

    this.router.events.subscribe((events) => {
      if (events instanceof NavigationEnd) {
        let currentRoute = this.activatedRoute.root;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        this.getParams(currentRoute);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createBreadcrumb(currentRoute: ActivatedRoute) {
    currentRoute.data.subscribe({
      next: (data) => {
        let breadcrumb = data;
        if (breadcrumb && breadcrumb['breadcrumb']) {
          breadcrumb['breadcrumb'] = breadcrumb['breadcrumb'].map(
            (item: Breadcrumb) => {
              if (item.router === 'movie') {
                item.label = this.movieTitle;
              } else {
                this.translate
                  .get('breadcrumb.' + item.router)
                  .subscribe((translatedLabel: string) => {
                    item.label = translatedLabel;
                  });
              }
              return item;
            }
          );

          this.breadcrumb = breadcrumb['breadcrumb'];
        } else {
          this.breadcrumb = [];
        }
      },
    });
  }

  updateBreadcrumb() {
    this.breadcrumb = this.breadcrumb.map((item: Breadcrumb) => {
      if (item.router === 'movie') {
        this.movieService
          .getDetailsMovies(Number(this.movieId), this.language.code)
          .subscribe({
            next: (movie) => {
              this.movieTitle = movie.title;
              item.label = movie.title;
            },
          });
      } else {
        this.translate
          .get('breadcrumb.' + item.router)
          .subscribe((translatedLabel: string) => {
            item.label = translatedLabel;
          });
      }

      return item;
    });
  }

  getParams(currentRoute: ActivatedRoute, page = 'movie') {
    if ((page = 'movie')) {
      let idNum = 0;
      currentRoute.paramMap.subscribe((paramMap) => {
        this.movieId = Number(paramMap.get('id'));
      });

      if (this.movieId != 0) {
        this.movieService
          .getDetailsMovies(Number(this.movieId), this.language.code)
          .subscribe({
            next: (movie) => {
              this.movieTitle = movie.title;
              this.createBreadcrumb(currentRoute);
            },
          });
      } else {
        this.createBreadcrumb(currentRoute);
      }
    }
  }

  selectLanguage(language: Language) {
    this.languageService.changeLanguage(language);
  }
}
