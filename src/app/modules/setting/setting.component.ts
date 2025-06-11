import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-setting',
  imports: [ReactiveFormsModule,NgIf],
  standalone:true,
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
   settingsForm: FormGroup;
  constructor(private userService:UserService,private fb: FormBuilder,private authService:AuthService){
      this.settingsForm = this.fb.group({
      email: ['', [Validators.email, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  onUpdate() {
    console.log("Update btn clicked");
    if (this.settingsForm.valid) {
      // Move updateUser call inside subscription to ensure userId is available
      this.authService.me().subscribe(data => {
        const userId = data.id;
        this.userService.updateUser(userId, this.settingsForm.value).subscribe({
          next: (response) => {
            console.log("Updated Successfully");
          },
          error: (error) => {
            console.log(error);
          }
        });
      });
    }
  }
}

