import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Exam } from '../../../core/models/exam';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-view-all-exam',
  imports: [CommonModule,RouterModule],
  templateUrl: './admin-view-all-exam.component.html',
  styleUrl: './admin-view-all-exam.component.css',
})
export class AdminViewAllExamComponent implements OnInit {
  allExams: any[] = [];
  filteredExams: any[] = [];
  displayedExams: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalExams: number = 0;
  isLoading = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllExams();

    // Setup search with debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.applySearch();
      });
  }

  loadAllExams(){
    this.examService.getAllExams().subscribe({
      next: (response) => {
        this.allExams = response.reverse();
        this.filteredExams = [...response];
        this.totalExams = response.length;
        this.updateDisplayedExams();
        this.isLoading = false;
      }
    })
  }
  updateDisplayedExams(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedExams = this.filteredExams.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedExams();
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
    return Math.ceil(this.totalExams / this.pageSize);
  }
  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }
  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredExams = [...this.allExams];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredExams = this.allExams.filter(
        (exam) =>
          exam.title.toLowerCase().includes(term) ||
          exam.description.toLowerCase().includes(term) ||
          exam.courseName.toLowerCase().includes(term) ||
          exam.teacherName.toLowerCase().includes(term)
      );
    }
    this.currentPage = 0; // Reset to first page when searching
    this.totalExams = this.filteredExams.length;
    this.updateDisplayedExams();
  }

  updateExam(examId: number){
    console.log('update exam With Id:', examId);
    this.router.navigate(['admin/update-exam', examId]);
  }

}
