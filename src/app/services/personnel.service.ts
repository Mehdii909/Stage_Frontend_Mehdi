import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/personnelModel';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  constructor(private http: HttpClient) { }

  getAllPersonnels() {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/personnels', { headers });
  }

  getAllPersonnelEtatActif() {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/personnels/activer', { headers });
  }

  addPersonnel(perso: {
    nom: string;
    prenom: string;
    email: string;
    fonction: string;
    etat: string;
    num: string[];
    user: User;
  }) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.post(environment.url + '/personnels', perso, { headers });
  }

  archiverPersonnel(id) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/personnels/' + id + '/archiver', { headers })
  }

  updatePersonnel(id, personnel) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/personnels/' + id, personnel , { headers })
  }
}
