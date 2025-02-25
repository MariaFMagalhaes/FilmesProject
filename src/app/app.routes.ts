import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
                data: []
            }
            ,{
                path:'movies',
                component: MoviesComponent,
                data: {
                    breadcrumb: [
                        {label: 'Início', router: '/'},
                        {label: 'Filmes', router: 'movies'}
                    ]
                }
            },
            {
                path: 'movie/:id',
                component: MovieDetailsComponent,
                data: {
                    breadcrumb: [
                        {label: 'Início', router: '/'},
                        {label: 'Filmes', router: 'movies'},
                        {label: 'Detalhes', router: 'movie'}
                    ]

                }
            },

            {
              path: 'configs',
              component: ConfigurationsComponent
            }
        ]
    },

    {
        path:'**',
        component: NotFoundComponent
    }

];
