import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user';
import { RequestUser } from '../../../core/models/request-user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-add-user.component.html',
  styleUrl: './admin-add-user.component.css',
})
export class AdminAddUserComponent {
  newUser: User = new User('', '', '', '', '');
  constructor(private userService: UserService, private router: Router) {}
  onSubmit(form: NgForm) {
    if (form.valid) {
      const userToCreate = new User(
        form.value.username,
        form.value.password,
        form.value.name,
        form.value.email,
        form.value.role
      );
      this.userService.addUser(userToCreate).subscribe({
        next: (response) => {
          form.resetForm();
          Swal.fire('Success', 'User added successfully!', 'success');
          this.router.navigate(['admin/view-all-user']);
        },
        error: (error) => {
          console.error('Error adding user', error);
          Swal.fire('Error', 'Failed to add user. Please try again.', 'error');
        },
      });
    }
  }
}
