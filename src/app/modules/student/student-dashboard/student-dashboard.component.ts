import { Component } from '@angular/core';
import { StudentSidebarComponent } from "../student-sidebar/student-sidebar.component";
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from "../../admin/admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-student-dashboard',
  imports: [StudentSidebarComponent, RouterOutlet, AdminNavbarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {

}
