import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-common-button',
  imports: [CommonModule],
  templateUrl: './common-button.component.html',
  styleUrl: './common-button.component.scss'
})
export class CommonButtonComponent {
  @Input() label!: string;
  @Input() iconClass?: string;
  @Input() addClass!: string;
  @Input() largerButton: boolean = false;
  @Input() disabled: boolean = false;
}
