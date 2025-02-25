import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'app-filmes';
  languageSubscription = new Subscription;

  constructor(private translate: TranslateService, private languageService: LanguageService) {

  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.getLanguage().subscribe(({
      next: (language) => {
        this.translate.use(language.code);
      }
    }))
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }


}
