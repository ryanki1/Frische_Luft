export interface AirDisplayCity {
  status: string; // status: success
  data: {
    city: string; // city: Freiburg
    state: string; // state: Baden Württemberg
    country: string; // country: Germany
    location: {
      type: string; // type: Point
      coordinates: [number, number]; // LatLng
    }
    current: {
      pollution: {
        ts: string,
        aqius: number; // air-quality: us index
        mainus: string; // main-pollutant-us: p2
        aqicn: number; // air-quality: china index
        maincn: string; // main-pollutant-china: p2
      }
      weather: {
        ts: string; // timestamp: "2025-03-27T12:00:00.000Z"
        tp: number; // temperature: 12
        pr: number; // pressure: 1018
        hu: number; // humidity: 61
        ws: number; // wind-speed: 5.36
        wd: number; // wind-direction: 353
        ic: string; // TODO ???
      }
    }
  }
}
