import { Component, OnInit } from '@angular/core';
import { RequestUser } from '../../../core/models/request-user';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admin-view-all-users',
  imports: [CommonModule],
  templateUrl: './admin-view-all-users.component.html',
  styleUrl: './admin-view-all-users.component.css',
})
export class AdminViewAllUsersComponent implements OnInit {
  allUser: RequestUser[] = [];
  filteredUsers: RequestUser[] = [];
  displayedUsers: RequestUser[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalUsers: number = 0;
  isLoading = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllUsers();

    // Setup search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.applySearch();
    });
  }
  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (respons) => {
        this.allUser = respons.reverse();
        this.filteredUsers = [...respons];
        this.totalUsers = respons.length;
        this.updateDisplayedUsers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load users. Please try again later.',
        });
      },
    });
  }
  updateDisplayedUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedUsers();
  }
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const maxVisiblePages = 5;
    const pages = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, this.currentPage + 1 - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  }
  getTotalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }
  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }
  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.allUser];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.allUser.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    }
    this.currentPage = 0; // Reset to first page when searching
    this.totalUsers = this.filteredUsers.length;
    this.updateDisplayedUsers();
  }
}
