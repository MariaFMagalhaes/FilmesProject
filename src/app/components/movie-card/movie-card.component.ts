import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movies';
import { CommonModule, DatePipe } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class CardMovieComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() imgSrc!: string;
  @Input() date!: string;
  @Input() liked!: boolean;
  @Input() language!: string;
  @Input() notChangeIcon: boolean = false;

  @Output() likeChange = new EventEmitter<boolean>();

  constructor(private movieService: MovieService, private languageService: LanguageService) {
  }

  toggleLikeOrDislike(event: Event) {
    event.stopPropagation();
    if(!this.notChangeIcon) {
      this.liked = !this.liked;
    }
    this.likeChange.emit(this.liked);
  }
}
