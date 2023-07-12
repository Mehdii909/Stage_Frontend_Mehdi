import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/eleveModel';

@Injectable({
  providedIn: 'root'
})
export class EleveService {

  constructor(private http: HttpClient) { }

  getAllEleves() {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/eleves', { headers });
  }

  getAllEleveEtatActif() {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/eleves/actifs', { headers });
  }

  addEleve(el: {
    nationalite: string;
    numTels: string[];
    nomPere: string;
    prenomMere: string;
    nomMere: string;
    nom: string;
    prenom: string;
    etat: string;
    user: User;
    email: string;
    prenomPere: string
  }) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.post(environment.url + '/eleves', el, { headers });
  }

  archiverEleve(id) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/eleves/' + id + '/archiver', { headers })
  }

  updateEleve(id, eleve) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/eleves/' + id, eleve , { headers })
  }
}
