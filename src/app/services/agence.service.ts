import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Agence } from '../models/agenceModel';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  constructor(private http: HttpClient) { }

  getAllAgences() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Agence[]>(environment.url + '/agences', { headers });
  }

  getAgenceById(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Agence>(environment.url + '/agences/' + id, { headers });
  }

  addAgence(agence: Agence) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Agence>(environment.url + '/agences', agence, { headers });
  }

  updateAgence(id: number, agence: Agence) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Agence>(environment.url + '/agences/' + id, agence, { headers });
  }

  deleteAgence(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(environment.url + '/agences/' + id, { headers });
  }

  getAllAgenceEtatActif() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/agences/actives', { headers });
  }

  archiverAgence(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/agences/' + id + '/archiver', { headers });
  }

  // Add more methods as needed

}
