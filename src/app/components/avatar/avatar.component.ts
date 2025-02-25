import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() img!: string;
  @Input() largerImage: boolean = false;
  @Input() isBold: boolean = false;
  @Input() noMargin: boolean = false;
  @Input() hover: boolean = false;

  imageExists() : boolean{
    if(this.img == '' || this.img == 'https://image.tmdb.org/t/p/w500/null' || this.img == 'https://image.tmdb.org/t/p/w500/') {
      return false;
    }
    return true;
  }
}
