import { Component } from '@angular/core';
import { MapComponent } from './component/map/map.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  panelOpen = false;

  togglePanel(): void {
    this.panelOpen = !this.panelOpen;
  }
}
