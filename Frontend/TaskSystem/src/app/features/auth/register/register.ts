import { Component } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { RegisterDto } from '../../../shared/models/register.dto';
import { RegisterResponseDto } from '../../../shared/models/register-response.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]  
})
export class RegisterComponent {
  registerData: RegisterDto = {
    username: '',
    email: '',
    password: ''
  };
  
  constructor(private auth: Auth, private router: Router  ) {}

  onSubmit() {
  this.auth.register(this.registerData).subscribe({
    next: (response: RegisterResponseDto) => {
      console.log('Register successful:', response.message);
      this.router.navigate(['/login']);
    },
    error: (error) => {
      console.error('Register failed:', error);
    }
  });
  }
}