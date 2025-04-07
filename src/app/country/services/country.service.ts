import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryService {

  http = inject(HttpClient);
  private baseURL = 'https://restcountries.com/v3.1';

  //Es privado así que depende de un GETTER
  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  get regions() {return this._regions} // <------------

  getCountriesByRegion( region: string ): Observable<Country[]>{
    if (!region) return of([]);
    const url = `${ this.baseURL }/region/${ region }?fields=cca3,name,borders`;
    return this.http.get<Country[]>(url)
  }

  getCountryByAlphaCode( alphaCode: string ): Observable<Country> {
    const url = `${ this.baseURL }/alpha/${ alphaCode }?fields=cca3,name,borders`;

    return this.http.get<Country>(url)
  }

  getCountryNamesByCodes( countryCodes:  string[] ): Observable<Country[]> {
    if (!countryCodes || countryCodes.length === 0) return of([]);

    const countriesRequests: Observable<Country>[] = [];

    countryCodes.forEach( code => {
      const request = this.getCountryByAlphaCode( code );
      countriesRequests.push(request);
    });

    // El combine latest nos va a permitir pasar un arreglo de suscripciones y todas van a emitir valores
    return combineLatest(countriesRequests);
  }
}
