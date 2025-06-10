import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaperService } from '../../../core/services/paper.service';
import { QuestionService } from '../../../core/services/question.service';
import { debounceTime, distinctUntilChanged, forkJoin, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-view-all-result',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view-all-result.component.html',
  styleUrl: './admin-view-all-result.component.css'
})
export class AdminViewAllResultComponent implements OnInit, OnDestroy {
  allResult: any[] = [];
  questionsCache: { [key: number]: any } = {}; // Cache for questions to avoid repeated API calls
  userRole: string = 'ADMIN';
  userId: number = 0;

  filteredResult: any[] = [];
  displayedResult: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalResult: number = 0;
  totalPages: number = 0;
  isLoading = false;
  searchTerm = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  constructor(
    private paperService: PaperService,
    private questionService: QuestionService,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.setupSearch();
    this.me(); 
  }
  me(){
    this.authService.me().subscribe({
      next: (user) => {
        this.userRole = user.role;
        this.userId = user.id;
        if (this.userRole === 'ADMIN') {
          this.getAllResult();
        }
        else if (this.userRole === 'STUDENT') {
          this.getAllResultByStudentId();
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }

  getAllResult() {
    this.paperService.getAllResult().subscribe({
      next: (results) => {
        // Initialize expanded property for each paper
        this.allResult = results.map((paper: any) => ({
          ...paper,
          expanded: false,
          questionsLoaded: false, // Track if questions are loaded for this paper
          questionDetails: [] // Store question details for this paper
        }));
        this.filterAndPaginate();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching results:', error);
      }
    });
  }

  getAllResultByStudentId() {
    this.paperService.getAllResultByStudentId(this.userId).subscribe({
      next: (results) => {
        // Initialize expanded property for each paper
        this.allResult = results.map((paper: any) => ({
          ...paper,
          expanded: false,
          questionsLoaded: false, // Track if questions are loaded for this paper
          questionDetails: [], // Store question details for this paper
        }));
        this.filterAndPaginate();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching results:', error);
      },
    });
  }

  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.filterAndPaginate();
    });
  }

  onSearchChange(searchTerm: string) {
    this.searchSubject.next(searchTerm);
  }

  filterAndPaginate() {
    // Filter results based on search term
    this.filteredResult = this.allResult.filter(paper =>
      this.searchTerm
        ? paper.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          paper.studentName?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true
    );

    // Update pagination
    this.totalResult = this.filteredResult.length;
    this.totalPages = Math.ceil(this.totalResult / this.pageSize);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }

    // Calculate displayed results
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedResult = this.filteredResult.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterAndPaginate();
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }

  togglePaper(paper: any): void {
    paper.expanded = !paper.expanded;
    
    // Load question details when expanding for the first time
    if (paper.expanded && !paper.questionsLoaded) {
      this.loadQuestionDetails(paper);
    }
  }

  loadQuestionDetails(paper: any): void {
    // Get unique question IDs from student answers
    const questionIds: any[] = [...new Set(paper.studentAnswer.map((answer: any) => answer.questionId))];
    
    // Check which questions are not in cache
    const uncachedIds = questionIds.filter((id: number) => !this.questionsCache[id]);
    
    if (uncachedIds.length > 0) {
      // Load uncached questions
      const questionRequests = uncachedIds.map(id => 
        this.questionService.getQuestionById(id)
      );
      
      forkJoin(questionRequests).subscribe({
        next: (questions) => {
          // Cache the questions
          uncachedIds.forEach((id, index) => {
            this.questionsCache[id] = questions[index];
          });
          
          // Process question details for this paper
          this.processQuestionDetails(paper);
        },
        error: (error) => {
          console.error('Error fetching question details:', error);
        }
      });
    } else {
      // All questions are already cached
      this.processQuestionDetails(paper);
    }
  }

  processQuestionDetails(paper: any): void {
    paper.questionDetails = paper.studentAnswer.map((answer: any) => {
      const question = this.questionsCache[answer.questionId];
      return {
        ...answer,
        questionText: question ? question.text : 'Question not found',
        correctAnswerText: this.getAnswerText(question, answer.correctAnswer),
        givenAnswerText: this.getAnswerText(question, answer.givenAnswer),
        isCorrect: answer.correctAnswer === answer.givenAnswer
      };
    });
    
    paper.questionsLoaded = true;
  }

  private getAnswerText(question: any, answerNumber: number): string {
    if (!question) return 'N/A';
    
    switch (answerNumber) {
      case 1: return question.option1 || 'N/A';
      case 2: return question.option2 || 'N/A';
      case 3: return question.option3 || 'N/A';
      case 4: return question.option4 || 'N/A';
      default: return 'N/A';
    }
  }
}