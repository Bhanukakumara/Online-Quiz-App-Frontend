import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../core/services/course.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admin-view-all-course',
  imports: [CommonModule],
  templateUrl: './admin-view-all-course.component.html',
  styleUrl: './admin-view-all-course.component.css',
})
export class AdminViewAllCourseComponent implements OnInit {
  allCoures: any[] = [];
  filteredCoures: any[] = [];
  displayedCoures: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalCoures: number = 0;
  isLoading = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadAllCoures();

    // Setup search with debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.applySearch();
      });
  }
  loadAllCoures() {
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.allCoures = response.reverse();
        this.filteredCoures = [...response];
        this.totalCoures = response.length;
        this.updateDisplayedCoures();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching courses', error);
        Swal.fire(
          'Error',
          'Failed to load courses. Please try again later.',
          'error'
        );
      },
    });
  }
  updateDisplayedCoures(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedCoures = this.filteredCoures.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedCoures();
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
    return Math.ceil(this.totalCoures / this.pageSize);
  }
  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }
  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredCoures = [...this.allCoures];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCoures = this.allCoures.filter(
        (coure) =>
          coure.name.toLowerCase().includes(term) ||
          coure.description.toLowerCase().includes(term)
      );
    }
    this.currentPage = 0; // Reset to first page when searching
    this.totalCoures = this.filteredCoures.length;
    this.updateDisplayedCoures();
  }
}
