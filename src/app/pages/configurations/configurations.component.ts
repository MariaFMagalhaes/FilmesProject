import { Component } from '@angular/core';
import { CommonButtonComponent } from "../../components/common-button/common-button.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configurations',
  imports: [CommonModule, FormsModule, CommonButtonComponent],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss'
})
export class ConfigurationsComponent {
  option!: string;

  submitOption() {
    this.option = '';
  }
}
