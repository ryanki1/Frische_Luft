import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import * as L from 'leaflet';
import '@dvina/ngx-leaflet-heat';
import { AirDisplayCity } from '../../service/model/AirDisplayCity';
import { CityService } from '../../service/city.service';
import { filter } from 'rxjs';
import { LatLng } from 'leaflet';
import { MAX_AQICN } from '../../shared/constants';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  standalone: true,
  imports: [],
  providers: [ApiService],
})
export class MapComponent implements OnInit {
  private map: L.Map | undefined;
  private readonly cityService = inject(CityService);
  private displayedCities: Map<string, AirDisplayCity> = new Map();

  public ngOnInit() {
    this.initMap();
    this.listenForCityChange();
  }

  private initMap() {
    this.map = L.map('map', {
      minZoom: 3,
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([48.29131, 8.32514], 13);
    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map!);
    this.addLegend();
  }

  private addLegend() {
    // Add a custom legend as a Leaflet control
    const legend = L.control.zoom({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'aqi-legend');
      div.innerHTML = `
      <h4>Pollution (PM2.5)</h4>
      <div style="display: flex; align-items: center;justify-content: center">
        <div style="width: 2rem; height: 6rem; background: linear-gradient(to bottom, maroon, red, yellow, lime); margin-right: .5rem;"></div>
        <div style="display: flex; flex-direction: column; justify-content: space-between; height: 6rem">
          <span>High</span>
          <span>Medium</span>
          <span>Low</span>
        </div>
      </div>
    `;
      return div;
    };

    legend.addTo(this.map!);
  }

  private listenForCityChange(): void {
    this.cityService.selectedCity$
      .pipe(
        filter((cityAir): cityAir is AirDisplayCity => !!cityAir && 'data' in cityAir)
      )
      .subscribe((cityAir: AirDisplayCity | undefined) => {
        if (cityAir) {
          if (this.displayedCities.has(cityAir.data.city)) {
            console.log(`${cityAir.data.city} is already displayed on the map.`);
            console.log(Array.from(this.displayedCities.entries()));
            this.centerMap(cityAir);
            return;
          }
          this.displayedCities.set(cityAir.data.city, cityAir);
          this.addHeatLayer(cityAir);
          console.log(Array.from(this.displayedCities.entries()));
          this.centerMap(cityAir);
        }
      });
  }

  private addHeatLayer(cityAir: AirDisplayCity): void {
    if (!cityAir) {
      return;
    }
    const heatData = Array.from(this.displayedCities.values()).map((cityAir) => [cityAir!.data.location.coordinates[1],
      cityAir!.data.location.coordinates[0],
      cityAir!.data.current.pollution.aqicn]) as unknown as LatLng[];
    const heatLayer = L.heatLayer(heatData, {
      radius: 20,
      blur: 15,
      maxZoom: 0,
      max: MAX_AQICN,
      minOpacity: 0.3,
      gradient: {
        0.1: 'lime',    // Good (0–50 normalized as 0–0.1, e.g. 10 / 500 = .02)
        0.2: 'yellow',  // Moderate (51–100 normalized as 0.1–0.2)
        0.3: 'orange',  // Slight Pollution (101–150 normalized as 0.2–0.3)
        0.4: 'red',     // Moderate Pollution (151–200 normalized as 0.3–0.4)
        0.6: 'purple',  // Heavy Pollution (201–300 normalized as 0.4–0.6)
        1.0: 'maroon'   // Severe Pollution (300+ normalized as 0.6–1.0)
      }
    });
    this.map!.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        this.map!.removeLayer(layer); // Remove current heatmap
      }
    });
    heatLayer.addTo(this.map!);
  }

  private centerMap(cityAir: AirDisplayCity): void {
    console.log(`Centering map on: ${cityAir.data.city}`);
    this.map!.setView([cityAir.data.location.coordinates[1], cityAir.data.location.coordinates[0]], 4);
  }

}
