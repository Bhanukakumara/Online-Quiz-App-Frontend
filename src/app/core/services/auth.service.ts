import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }

  doLogin(loginRequest:LoginRequest): Observable<any>{
    return this.http.post('http://localhost:8080/auth/login', loginRequest);
  }

  me():Observable<any> {
    return this,this.http.get('http://localhost:8080/auth/me')
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || [];
    } catch {
      return [];
    }
  }

  hasRole(requiredRole: string): boolean {
    const userRoles = this.getRoles();
    return userRoles.includes(requiredRole);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isTeacher(): boolean {
    return this.hasRole('TEACHER');
  }

  isStudent(): boolean {
    return this.hasRole('STUDENT');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
