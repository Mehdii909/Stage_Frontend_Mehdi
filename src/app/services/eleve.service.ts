import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/eleve';
import {Observable} from 'rxjs';

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
    return this.http.get(environment.url + '/eleves/activer', { headers });
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

  getEleveByNomAndPrenom(nom: string, prenom: string): Observable<any> {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    const params = new HttpParams()
        .set('nom', nom)
        .set('prenom', prenom);

    return this.http.get(environment.url + '/eleves/by-nom-prenom', { headers, params });
  }

}
