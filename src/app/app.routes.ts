import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ChurrascoComponent } from './components/churrasco/churrasco.component';
import { CalculosComponent } from './components/calculos/calculos.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'calculos',
    component: CalculosComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'churrasco',
    component: ChurrascoComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
