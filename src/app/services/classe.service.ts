import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Classe } from '../models/classe';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  constructor(private http: HttpClient) { }

  getAllClasses() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<Classe[]>(environment.url + '/classes', { headers });
  }

  getAllClasseEtatActif() {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.get(environment.url + '/classes/activer', { headers });
  }

  addClasse(classe: { cycle: string; niveau: string; etat: string; numClasse: string }) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Classe>(environment.url + '/classes', classe, { headers });
  }

  archiverClasse(id) {
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    return this.http.put(environment.url + '/classes/' + id + '/archiver', { headers })
  }

  updateClasse(id: number, classe: Classe) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<Classe>(environment.url + '/classes/' + id, classe, { headers });
  }

  deleteClasse(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(environment.url + '/classes/' + id, { headers });
  }

  // Add more methods as needed

}
