import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-main',
  imports: [],
  templateUrl: './student-main.component.html',
  styleUrl: './student-main.component.css',
})
export class StudentMainComponent implements OnInit {
  userName: string = '';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.getUserName();
  }
  getUserName() {
    this.authService.me().subscribe({
      next: (user) => {
        this.userName = user.name;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        Swal.fire(
          'Error',
          'Failed to fetch user data. Please try again later.',
          'error'
        );
      },
    });
  }
}
