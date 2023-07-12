import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 

  }
  
  logine(email: string, password: string) {
    // Make API request to login endpoint
    return this.http.post('http://localhost:8081/api/auth/authenticate', { email, password });
  }
  register(username: string, password: string,email:string){
   return this.http.post('http://localhost:8081/api/auth/register', {username, email, password });

  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8081/api/auth/authenticate`, { email, password });
  }

  logout(): void {
    // Remove the token from local storage or session storage
    localStorage.removeItem('token'); // Change 'token' to the key you are using
    sessionStorage.removeItem('token')
  }

  getToken(): string  {
    return localStorage.getItem('token'); // Change 'token' to the key you are using
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Check if the token is present and not expired
    return token !== null;
  }
}
