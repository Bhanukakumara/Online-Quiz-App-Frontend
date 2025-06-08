import { Component, OnInit } from '@angular/core';
import { RequestUser } from '../../../core/models/request-user';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-view-all-users',
  imports: [CommonModule],
  templateUrl: './admin-view-all-users.component.html',
  styleUrl: './admin-view-all-users.component.css',
})
export class AdminViewAllUsersComponent implements OnInit {

  allUser: RequestUser[] = [];
  isLoading = false;
  searchTerm: any = ''; 
  activeTab: string = 'tab1';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.allUser = response;
      },
      error: (error) => {
        console.error('Error fetching users', error);
        Swal.fire('Error', 'Failed to load users. Please try again later.', 'error');
      
      },
    });
  }
  
  tabs = [
    { id: 'tab1', title: 'All Users' },
    { id: 'tab2', title: 'All Admin' },
    { id: 'tab3', title: 'All Teacher' },
    { id: 'tab4', title: 'All Student' },
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  isActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
