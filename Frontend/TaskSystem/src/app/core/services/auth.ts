import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginDto } from '../../shared/models/login.dto';
import { RegisterDto } from '../../shared/models/register.dto';
import { AuthResponseDto } from '../../shared/models/auth-response.dto';
import { RegisterResponseDto } from '../../shared/models/register-response.dto';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = environment.apiUrl + '/auth';

  private userSubject = new BehaviorSubject<AuthResponseDto | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(dto: LoginDto) {
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, dto);
  }

  register(dto: RegisterDto) {
    return this.http.post<RegisterResponseDto>(`${this.baseUrl}/register`, dto);
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const rolesStr = localStorage.getItem('roles');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (token && rolesStr && username && email) {
      const user: AuthResponseDto = {
        token,
        roles: JSON.parse(rolesStr),
        username,
        email,
        message: 'Loaded from storage',
      };
      this.userSubject.next(user);
    }
  }

  setUser(user: AuthResponseDto) {
    this.userSubject.next(user);
    localStorage.setItem('token', user.token);
    localStorage.setItem('roles', JSON.stringify(user.roles));
    localStorage.setItem('username', user.username);
    localStorage.setItem('email', user.email);
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  /* ===================== ROLE CHECKS ===================== */
  isLoggedIn() {
    return !!this.userSubject.value?.token;
  }

  isSuperAdmin() {
    return this.userSubject.value?.roles.includes('SuperAdmin') ?? false;
  }

  isAdmin() {
    return this.userSubject.value?.roles.includes('Admin') ?? false;
  }

  isUser() {
    return this.userSubject.value?.roles.includes('User') ?? false;
  }
}