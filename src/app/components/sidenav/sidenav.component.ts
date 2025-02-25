import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarComponent } from "../avatar/avatar.component";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive,CommonModule,AvatarComponent, TranslateModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SideNavComponent {
  @Input() userImg!: string;
  @Input() userName!: string;

  constructor(private router: Router) {
    this.userImg = 'assets/imagem-profile.jpg';
    this.userName = 'Jack Thomeson';
  }

  isMoviesActive(): boolean {
    return this.router.isActive('/movies', true) || this.router.url.startsWith('/movie');
  }
}