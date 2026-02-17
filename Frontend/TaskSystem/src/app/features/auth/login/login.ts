import { Component, NgModule } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { LoginDto } from '../../../shared/models/login.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login 
{
  loginData: LoginDto = {
    email: '',
    password: ''
  };

  constructor(private auth: Auth, private router: Router) {}

 onSubmit(){
  this.auth.login(this.loginData).subscribe({
    next: (response) => {
      // هنا نحدّث الـ BehaviorSubject مباشرة
      this.auth.setUser({
        token: response.token,
        username: response.username,
        email: response.email,
        roles: response.roles,
        message: response.message
      });

      // نحتفظ بالـ token/username/roles
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      localStorage.setItem('roles', JSON.stringify(response.roles));

      this.router.navigate(['/dashboard']);
      console.log('Login successful:', response);
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      console.log('Is logged in:', this.auth.isLoggedIn());  
      console.log('is user', this.auth.isUser());
      console.log('is admin', this.auth.isAdmin());
      console.log('is super admin', this.auth.isSuperAdmin());
    },
    error: (error) => {
      console.error('Login failed:', error);
    }
  });
}
}
