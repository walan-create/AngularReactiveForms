import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder);
  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);
  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  // * Los effect se lanzan en cuanto el componente es montado
  onFormChanged = effect((onCleanup) => {
    //Para cambiar activamente los campos del form
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    //Al cerrar el componente se limpian los datos
    onCleanup(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });

  // Metodo especializado para el cambio de la región
  onRegionChanged() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap((region) => this.myForm.get('country')!.setValue('')), // Cuando cambiamos de region el campo de país se limpia
        tap((region) => this.myForm.get('border')!.setValue('')), // Cuando cambiamos de region el campo de frontera se limpia
        tap((region) => {
          this.borders.set([]);
          this.countriesByRegion.set([]);
        }),
        switchMap((region) =>
          this.countryService.getCountriesByRegion(region ?? '')
        ) // Mapea la region que tenemos a una lista de countries
      )
      .subscribe((countries) => {
        this.countriesByRegion.set(countries);
      });
  }

  onCountryChanged() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((countryCode) =>
          this.countryService.getCountryByAlphaCode(countryCode ?? '')
        ),
        switchMap((country) =>
          this.countryService.getCountryNamesByCodes(country.borders) // Mapea el pais que tenemos a una lista de fronteras
        )
      )
      .subscribe((borders) => {
        this.borders.set(borders)
        console.log({ borders: borders });
      });
  }
}
