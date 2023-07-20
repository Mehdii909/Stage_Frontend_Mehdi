import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Station } from '../models/Station';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getAllStations() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Station[]>(environment.url + '/stations', { headers });
  }

  getAllStationEtatActif() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/stations/activer', { headers });
  }

  addStation(station: {
    nom: string;
    region: string;
    coordonneesGpsLatitude: string;
    coordonneesGpsLongitude: string;
    etat: string;
  }) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Station>(environment.url + '/stations', station, { headers });
  }

  archiverStation(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/stations/' + id + '/archiver', { headers });
  }

  updateStation(id: number, station: Station) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Station>(environment.url + '/stations/' + id, station, { headers });
  }

  deleteStation(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(environment.url + '/stations/' + id, { headers });
  }

  // Add more methods as needed

}
