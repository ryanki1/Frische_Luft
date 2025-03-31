import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ADDRESS_SEPARATOR } from '../shared/constants';
import { replaceUmlauts } from '../shared/utilities';

/**
 * Third party API: IQAir
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  public getCityAir(cityKey: string): Observable<any> {
    const cleanedCityKey = replaceUmlauts(cityKey);
    const [cityName, state, country] = cleanedCityKey.split(ADDRESS_SEPARATOR);
    const apiUrl = environment.apiUrl;
    const apiKey = environment.apiKey;
    return this.http.get(`${apiUrl}city?city=${cityName}&state=${state}&country=${country}&key=${apiKey}`);
  }

  public getCityDetails(cityName: string): Observable<any> {
    return this.http.get(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&addressdetails=1&limit=5&accept-language=en`);
  }

}
