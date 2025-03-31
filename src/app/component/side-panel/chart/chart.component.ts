import { Component, computed, input, Signal } from '@angular/core';
import { LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { ADDRESS_SEPARATOR, MAX_AQICN } from '../../../shared/constants';
import { capitalize } from '../../../shared/utilities';

/**
 * Vertical Barchart of selected cities and their PM2.5 measurement
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {

  selectedCities = input<{ name: string, value: number }[]>();
  barChartData: Signal<{ name: string; value: number, color: string, tooltip?: string }[]> = computed(() => {
    return this.selectedCities()?.map((item) => {
      return {
      name: capitalize(item.name.substring(0, item.name.indexOf(ADDRESS_SEPARATOR))),
      value: item.value,
      color: this.getGradientColor(item.value)
    }}) || [];
  });
  colorScheme = '#5AA454, #A10A28, #C7B42C, #AAAAAA';
  customColors = computed(() => {
    return {
      name: 'aqiColorScheme',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: this.barChartData().map((d) => d.color), // Assign dynamic colors
    };
  });

  // Return heatmap-based color for AQICN
  getGradientColor(value: number): string {
    const normalizedValue = value / MAX_AQICN;
    if (normalizedValue <= 0.1) {
      return '#00E400'; // Green (Good AQI)
    } else if (normalizedValue <= 0.2) {
      return '#FFFF00'; // Yellow (Moderate AQI)
    } else if (normalizedValue <= 0.3) {
      return '#FF7E00'; // Orange (Unhealthy for sensitive groups)
    } else if (normalizedValue <= 0.4) {
      return '#FF0000'; // Red (Unhealthy)
    } else if (normalizedValue <= 0.6) {
      return '#8F3F97'; // Purple (Very unhealthy)
    } else {
      return '#7E0023'; // Maroon (Hazardous)
    }
  }

  protected readonly LegendPosition = LegendPosition;
  protected readonly MAX_AQICN = MAX_AQICN;
}
