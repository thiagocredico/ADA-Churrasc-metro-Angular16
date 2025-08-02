import { Component, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { HeaderComponent } from './components/header/header.component';
registerLocaleData(ptBr);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'projeto-churrascometro';
}
