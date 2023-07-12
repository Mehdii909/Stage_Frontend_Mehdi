import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  username: any;
  email:any ;
  password: any ;

  constructor(private authService: AuthService,private router: Router,private http: HttpClient) {}
  registerData = {
    username: '',
    email: '',
    password: '',
    role: '' // Dynamically chosen role
  };
  login(): void {
    this.authService.login(this.registerData.email, this.registerData.password).subscribe(
      response => {
        // Store the token in local storage or session storage
        localStorage.setItem('token',response.jwt);

        sessionStorage.setItem('token', response.jwt); // Change 'token' to the key you want to use
        localStorage.setItem('role',this.registerData.role);
        sessionStorage.setItem('role', this.registerData.role); 



        this.router.navigate(['/dashboard']);
      },
      error => {
        console.log("err");
      }
    );
  }

  registerUser() {
    this.authService.register(this.username, this.password, this.email)
      .subscribe(
        (response) => {
          // Registration successful, handle the response
          this.login();
          console.log('Registration successful', response);
        },
        (error) => {
          // Registration failed, handle the error
          console.error('Registration failed', error);
        }
      );
  }
  registere() {
    return this.http.post('http://localhost:8081/api/auth/register', this.registerData).subscribe(
       () => {
         // Registration success
         this.login();
         console.log('Registration successful');
       },
       (error) => {
         // Registration error
         console.log('Registration error:', error);
       }
     );
   }
  
  
}
