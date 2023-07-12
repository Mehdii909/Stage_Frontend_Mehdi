import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authService: AuthService,private router: Router) {}
  email:any ;
  password:any ;
  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        // Assuming the token is returned in the response
        const token = response.token;
        // Store the token in local storage or session storage
        localStorage.setItem('token',response.jwt);
        sessionStorage.setItem('token', response.jwt); // Change 'token' to the key you want to use
        localStorage.setItem('role',response.role)
        sessionStorage.setItem('role',response.role)
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.log("err");
      }
    );
  }
}
