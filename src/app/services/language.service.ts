import { Injectable } from '@angular/core';
import { Language } from '../models/language';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages: Language[] = [];
  language!: Language;
  private languageSubject: BehaviorSubject<Language>;

  constructor() {
    this.setLanguages();
    let language = this.languages.find((lang) => lang.code == 'pt-BR');
    if(language) {
      this.language = language;
    }
    this.languageSubject = new BehaviorSubject<Language>(this.language);
  }

  setLanguages() {

    this.addLanguage({
      id: 1,
      name: 'Portugês',
      code: 'pt-BR',
      iconClass: 'fi fi-br'
    })

    this.addLanguage({
      id: 2,
      name: 'English',
      code: 'en-US',
      iconClass: 'fi fi-us'
    })

    this.addLanguage({
      id: 3,
      name: '日本語',
      code: 'ja-JP',
      iconClass: 'fi fi-jp'
    })

    this.addLanguage({
      id: 4,
      name: '한국어',
      code: 'ko-KR',
      iconClass: 'fi fi-kr'
    })
  }

  addLanguage(language: Language) {
    this.languages.push(language);
  }

  getAllLanguages(): Language[] {
    return this.languages;
  }

  getLanguage(): Observable<Language> {
    return this.languageSubject.asObservable();
  }

  changeLanguage(language: Language) {
      this.languageSubject.next(language);
  }
}