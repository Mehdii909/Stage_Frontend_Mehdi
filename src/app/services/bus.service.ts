import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Bus } from '../models/bus';
import {Agence} from '../models/agence';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http: HttpClient) { }

  getAllBuses() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Bus[]>(environment.url + '/buses', { headers });
  }

  getBusById(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Bus>(environment.url + '/buses/' + id, { headers });
  }

  addBus(bus: { agence: Agence; nombrePlaces: number; marqueModele: string; immatriculation: string; etat: string }) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Bus>(environment.url + '/buses', bus, { headers });
  }

  updateBus(id: number, bus: Bus) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Bus>(environment.url + '/buses/' + id, bus, { headers });
  }

  deleteBus(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(environment.url + '/buses/' + id, { headers });
  }

  getAllBusEtatActif() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/buses/activer', { headers });
  }

  getAllBusEtatActiverByAgenceId(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/buses/activer/' + id, { headers });
  }


  archiverBus(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/buses/' + id + '/archiver', { headers });
  }
}
