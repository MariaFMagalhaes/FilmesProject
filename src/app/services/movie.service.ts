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

    return this.http.get<{results: []}>(`${this.apiURL}/popular`, {
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

  // loadMovies() {
  //   this.addMovie({
  //     id: 1,
  //     title: 'Ainda estou aqui',
  //     img: 'https://96fmbauru.com.br/wp-content/uploads/2024/11/ainda-estou-aqui32409.webp',
  //     date: '7 de novembro de 2024',
  //     liked: false,
  //   });

  //   this.addMovie({
  //     id: 2,
  //     title: 'O Menino',
  //     img: 'https://br.web.img3.acsta.net/pictures/24/02/16/19/36/5568619.jpg',
  //     date: '14 de julho de 2023',
  //     liked: true,
  //   });

  //   this.addMovie({
  //     id: 3,
  //     title: 'A Substância',
  //     img: 'https://www.papodecinema.com.br/wp-content/uploads/2024/09/20241024-a-substancia.jpeg',
  //     date: '19 de setembro de 2024',
  //     liked: false,
  //   });

  //   this.addMovie({
  //     id: 4,
  //     title: 'Wicked',
  //     img: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/wicked/images/regions/us/onesheet.jpg',
  //     date: '21 de novembro de 2024',
  //     liked: true,
  //   });

  //   this.addMovie({
  //     id: 5,
  //     title: 'O Mundo Depois',
  //     img: 'https://i0.wp.com/vertentesdocinema.com/wp-content/uploads/2023/12/qwhzinq0mba1dxhv66exccuzbf5.jpg?fit=667%2C1000&ssl=1',
  //     date: '25 de outubro de 2023',
  //     liked: false,
  //   });

  //   this.addMovie({
  //     id: 6,
  //     title: 'It: A Coisa',
  //     img: 'https://upload.wikimedia.org/wikipedia/pt/8/82/It_2017.jpg',
  //     date: '7 de setembro de 2017',
  //     liked: true,
  //   })

  //   this.addMovie({
  //     id: 7,
  //     title: 'Star Wars: IX',
  //     img: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS3raWpqxulmDawzYZmlYyRZv-YAq9Qf9ehmgzDg7OkJL50Wlca',
  //     date: '19 de dezembro de 2019',
  //     liked: true,
  //   })

  //   this.addMovie({
  //     id: 8,
  //     title: 'Homem-Aranha',
  //     img: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg',
  //     date: '1 de junho de 2023',
  //     liked: false,
  //   });
    
  //   this.addMovie({
  //     id: 9,
  //     title: 'Ainda estou aqui',
  //     img: 'https://96fmbauru.com.br/wp-content/uploads/2024/11/ainda-estou-aqui32409.webp',
  //     date: '7 de novembro de 2024',
  //     liked: false,
  //   });

  //   this.addMovie({
  //     id: 10,
  //     title: 'O Menino',
  //     img: 'https://br.web.img3.acsta.net/pictures/24/02/16/19/36/5568619.jpg',
  //     date: '14 de julho de 2023',
  //     liked: true,
  //   });

  //   this.addMovie({
  //     id: 11,
  //     title: 'A Substância',
  //     img: 'https://www.papodecinema.com.br/wp-content/uploads/2024/09/20241024-a-substancia.jpeg',
  //     date: '19 de setembro de 2024',
  //     liked: false,
  //   });

  //   this.addMovie({
  //     id: 12,
  //     title: 'Wicked',
  //     img: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/wicked/images/regions/us/onesheet.jpg',
  //     date: '21 de novembro de 2024',
  //     liked: true,
  //   });

  //   this.addMovie({
  //     id: 13,
  //     title: 'O Mundo Depois',
  //     img: 'https://i0.wp.com/vertentesdocinema.com/wp-content/uploads/2023/12/qwhzinq0mba1dxhv66exccuzbf5.jpg?fit=667%2C1000&ssl=1',
  //     date: '25 de outubro de 2023',
  //     liked: true,
  //   });

  //   this.addMovie({
  //     id: 14,
  //     title: 'It: A Coisa',
  //     img: 'https://upload.wikimedia.org/wikipedia/pt/8/82/It_2017.jpg',
  //     date: '7 de setembro de 2017',
  //     liked: false,
  //   })

  //   this.addMovie({
  //     id: 15,
  //     title: 'Star Wars: IX',
  //     img: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS3raWpqxulmDawzYZmlYyRZv-YAq9Qf9ehmgzDg7OkJL50Wlca',
  //     date: '19 de dezembro de 2019',
  //     liked: false,
  //   })
  // }