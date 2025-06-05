import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user';
import { RequestUser } from '../../../core/models/request-user';

@Component({
  selector: 'app-admin-add-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-add-user.component.html',
  styleUrl: './admin-add-user.component.css',
})
export class AdminAddUserComponent{
newUser: User = new User('','','','','');
  constructor(private userService: UserService) {}
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
          alert('User added successfully!');
        },
        error: (error) => {
          console.error('Error adding user', error);
          alert('Error adding user.olease try again.');
        },
      });
    }
  }
}
