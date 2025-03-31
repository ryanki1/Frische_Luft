import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { ADDRESS_SEPARATOR } from '../shared/constants';

describe('Api Service', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let cityKeys = [
    {
      cityKey: `freiburg${ADDRESS_SEPARATOR}baden wuerttemberg${ADDRESS_SEPARATOR}germany`,
      expectedUrl: `${environment.apiUrl}city?city=freiburg&state=baden wuerttemberg&country=germany&key=${environment.apiKey}`
    }, {
      cityKey: `Freiburg im Breisgau${ADDRESS_SEPARATOR}Baden-Württemberg${ADDRESS_SEPARATOR}Germany`,
      expectedUrl: `${environment.apiUrl}city?city=Freiburg im Breisgau&state=Baden-Wuerttemberg&country=Germany&key=${environment.apiKey}`
    }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController); // Mocking HttpClient
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no other calls are made
  });

  cityKeys.forEach((cityKeyTest) => {
    it('should call the correct URL when getCityAir is called', () => {

      service.getCityAir(cityKeyTest.cityKey).subscribe();


      const req = httpMock.expectOne(cityKeyTest.expectedUrl);
      expect(req.request.method).toBe('GET');

      // Respond to the request
      req.flush({});
    });
  });
});
