import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comidas } from '../interfaces/comidas.interface';
import { Bebidas } from '../interfaces/bebidas.interface';

@Injectable({
  providedIn: 'root'
})
export class ChurrascoService {

  private API_URL = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  public getProteinas():  Observable<Comidas[]> {
    return this.http.get<Comidas[]>(`${this.API_URL}/proteinas`)

  }

  public getBebidas():  Observable<Bebidas[]> {
    return this.http.get<Bebidas[]>(`${this.API_URL}/bebidas`)

  }


}
