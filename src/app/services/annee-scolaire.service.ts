import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AnneeScolaire } from '../models/AnneeScolaire';

@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService {

  constructor(private http: HttpClient) { }

  getAllAnneesScolaires() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<AnneeScolaire[]>(environment.url + '/annees-scolaires', { headers });
  }

  getAllStationEtatActif() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/annees-scolaires/activer', { headers });
  }

  addAnneeScolaire(anneeScolaire: {
    etat: string;
    ans: string;
  }) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AnneeScolaire>(environment.url + '/annees-scolaires', anneeScolaire, { headers });
  }

  archiverAnneeScolaire(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/annees-scolaires/' + id + '/archiver', { headers });
  }

  updateAnneeScolaire(id: number, anneeScolaire: AnneeScolaire) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<AnneeScolaire>(environment.url + '/annees-scolaires/' + id, anneeScolaire, { headers });
  }

  deleteAnneeScolaire(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(environment.url + '/annees-scolaires/' + id, { headers });
  }

  // Add more methods as needed
}
