import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  loginRequest: LoginRequest = new LoginRequest();

  onSubmit() {
    if (!this.loginForm.valid) {
      Swal.fire('Error', 'Please enter valid credentials', 'error');
      return;
    }
    const formValues = this.loginForm.value;
    this.loginRequest.email = formValues.email;
    this.loginRequest.password = formValues.password;

    this.authService.doLogin(this.loginRequest).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.authService.me().subscribe({
          next: (user) => {
            if (user.role === 'ADMIN') {
              this.router.navigate(['admin/dashboard']);
            } else if (user.role === 'TEACHER') {
              this.router.navigate(['teacher/dashboard']);
            } else if (user.role === 'STUDENT') {
              this.router.navigate(['student/dashboard']);
            }
          },
        });
      },
    });
  }
}
