import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { AirDisplayCity } from './model/AirDisplayCity';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Reactive service for selection of city air data
 */
@Injectable({
  providedIn: 'root'
})
export class CityService {
  selectedCity = signal<AirDisplayCity | undefined>(undefined);
  selectedCity$: Observable<AirDisplayCity | undefined> = toObservable(this.selectedCity);
  selectedCities = signal<ReadonlyMap<string, AirDisplayCity>>(new Map());
  private readonly airService: ApiService = inject(ApiService);

  /**
   * Signal selected city and selected cities so far
   * @param cityKey e.g. city-state-country (Freiburg-Baden Wuerttemberg-Germany)
   */
  async selectCityAir(cityKey: string) {

    if (this.selectedCities().has(cityKey)) {
      this.selectedCity.set(this.selectedCities().get(cityKey));
      return; // No API call needed
    }

    try {
      const cityAir = await firstValueFrom(this.airService.getCityAir(cityKey));

      if (cityAir) {
        const updatedCities = new Map(this.selectedCities().entries());
        updatedCities.set(cityKey, cityAir);
        this.selectedCities.set(updatedCities);
        this.selectedCity.set(cityAir);
      }
    } catch (error: any) {
      this.selectedCity.set({} as AirDisplayCity);
    }

  }
}
