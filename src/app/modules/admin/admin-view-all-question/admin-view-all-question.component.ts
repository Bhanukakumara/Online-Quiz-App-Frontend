import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-view-all-question',
  imports: [CommonModule],
  templateUrl: './admin-view-all-question.component.html',
  styleUrl: './admin-view-all-question.component.css',
})
export class AdminViewAllQuestionComponent implements OnInit {
  allQuestion: any[] = [];
  filteredQuestion: any[] = [];
  displayedQuestion: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalQuestion: number = 0;
  isLoading = false;
  searchTerm = '';
  userRole: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllQuestion();

    // Setup search with debounce
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.applySearch();
      });

    this.me();
  }
  loadAllQuestion() {
    this.questionService.getAllQuestions().subscribe({
      next: (response) => {
        this.allQuestion = response.reverse();
        this.filteredQuestion = [...response];
        this.totalQuestion = response.length;
        this.updateDisplayedQuestion();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching question', error);
        Swal.fire(
          'Error',
          'Failed to load questions. Please try again later.',
          'error'
        );
      },
    });
  }
  updateDisplayedQuestion(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedQuestion = this.filteredQuestion.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedQuestion();
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
    return Math.ceil(this.totalQuestion / this.pageSize);
  }
  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }
  applySearch(): void {
    if (!this.searchTerm) {
      this.filteredQuestion = [...this.allQuestion];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredQuestion = this.allQuestion.filter(
        (question) =>
          question.text.toLowerCase().includes(term) ||
          question.option1.toLowerCase().includes(term) ||
          question.option2.toLowerCase().includes(term) ||
          question.option3.toLowerCase().includes(term) ||
          question.option4.toLowerCase().includes(term) ||
          question.examTitle.toLowerCase().includes(term)
      );
    }
    this.currentPage = 0; // Reset to first page when searching
    this.totalQuestion = this.filteredQuestion.length;
    this.updateDisplayedQuestion();
  }
  deleteQuestion(questionId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this question?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionService.deleteQuestionById(questionId).subscribe({
          next: (response) => {
            if (response) {
              // Remove the deleted question from allQuestion
              this.allQuestion = this.allQuestion.filter(
                (question) => question.id !== questionId
              );

              // Reapply search filter to update filteredQuestion
              this.applySearch();

              // Adjust current page if necessary
              const totalPages = this.getTotalPages();
              if (this.currentPage >= totalPages && totalPages > 0) {
                this.currentPage = totalPages - 1;
              }

              // Update displayed questions
              this.updateDisplayedQuestion();

              // Show success message
              Swal.fire(
                'Deleted!',
                'The question has been deleted.',
                'success'
              );
            } else {
              Swal.fire('Error', 'Failed to delete the question.', 'error');
            }
          },
          error: (error) => {
            console.error('Error deleting question', error);
            Swal.fire(
              'Error',
              'Failed to delete the question. Please try again.',
              'error'
            );
          },
        });
      }
    });
  }
  me() {
    this.authService.me().subscribe({
      next: (user) => {
        this.userRole = user.role;
      },
      error: (error) => {
        console.error('Error deleting user', error);
        Swal.fire(
          'Error',
          'Failed to catch the user. Please try again.',
          'error'
        );
      },
    });
  }
  updateQuestion(questionId: number) {
    if (this.userRole === 'ADMIN') {
      this.router.navigate([`/admin/edit-question/${questionId}`]);
    } else if (this.userRole === 'TEACHER') {
      this.router.navigate([`/teacher/edit-question/${questionId}`]);
    }
  }
}
