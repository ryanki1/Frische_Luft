import { Component, computed, inject, Signal } from '@angular/core';
import { MapComponent } from './component/map/map.component';
import { CityService } from './service/city.service';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ApiService } from './service/api.service';
import { map } from 'rxjs';
import { AirDisplayCity } from './service/model/AirDisplayCity';
import { ADDRESS_SEPARATOR } from './shared/constants';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './component/side-panel/chart/chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MapComponent, FormsModule, AutoComplete, NgxChartsModule, CommonModule, ChartComponent],
})
export class AppComponent {

  private readonly cityService = inject(CityService);
  private readonly airService = inject(ApiService);
  selectedCity= this.cityService.selectedCity;
  selectedCities: Signal<{name: string; value: number}[]> = computed(() => {
    return Array.from(this.cityService.selectedCities().entries()).map(([city, cityAir]) =>
      ({name: city, value: cityAir.data.current.pollution.aqicn})) as {name: string; value: number}[];
  });
  value: string | null = null;
  items: any[] = [];

  panelOpen = false;

  search(event: { query: string }) {
    const cityQuery = event.query; // Get the user input
    this.airService.getCityDetails(cityQuery)
      .pipe(
        map((data: { address: { city: string; state: string; country: string } }[]) =>
          data.map(addresses =>
            // "event.query" produces more useful results than "addresses.address.city"
          `${event.query || addresses.address.city}${ADDRESS_SEPARATOR}${addresses.address.state}${ADDRESS_SEPARATOR}${addresses.address.country}`))
      )
      .subscribe(data => this.items = data); // Update the suggestions
  }

  selectCity(selectCityEvent: AutoCompleteSelectEvent): void {
    this.cityService.selectCityAir(selectCityEvent.value as string); // Notify the city service of the selection
    this.value = null;
  }

  selectedCityIsEmpty(): boolean {
    const selectedCity = this.selectedCity() as AirDisplayCity;
    return selectedCity !== undefined && Object.keys(selectedCity).length === 0;
  }

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }

}
