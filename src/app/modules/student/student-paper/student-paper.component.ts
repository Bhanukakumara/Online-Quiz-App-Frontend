import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { PaperService } from '../../../core/services/paper.service';
import { Paper } from '../../../core/models/paper';
import { EnrollmentService } from '../../../core/services/enrollment.service';

@Component({
  selector: 'app-student-paper',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-paper.component.html',
  styleUrl: './student-paper.component.css',
})
export class StudentPaperComponent {
  questionList: any[] = [];
  paper: Paper = new Paper(new Date(), new Date(), 0, 0, 0, 0);
  examDetail: any = {};
  examId: number = 0;
  enrollmentId: number = 0;
  currentQuestion = 1;
  answeredQuestions = 0;
  totalQuestions = 0;
  selectedAnswers: { [key: number]: string } = {};
  startTime: Date;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private paperService: PaperService,
    private questionService: QuestionService,
    private authService: AuthService,
    private enrollmentService: EnrollmentService
  ) {
    this.startTime = new Date();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.examId = params['examId'];
      this.loadQuestionPaper();
      this.loadExamDetails();
    });
  }

  loadQuestionPaper() {
    this.isLoading = true;
    this.questionService.getQuestionPaperByExamId(this.examId).subscribe({
      next: (response) => {
        this.questionList = response;
        this.totalQuestions = this.questionList.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam data', error);
        this.isLoading = false;
      },
    });
  }

  loadExamDetails(){
    this.examService.getExamById(this.examId).subscribe({
        next: (exam) => {
          this.examDetail = exam;
        },
        error: (error) => {
          console.error('Error loading exam details', error);
          alert('Error loading exam details. Please try again.');
        },
      });
  }

  answerChanged(questionId: number, answer: string) {
    if (!this.selectedAnswers[questionId]) {
      this.answeredQuestions++;
    }
    this.selectedAnswers[questionId] = answer;
  }

  isCurrentQuestion(index: number): boolean {
    return this.currentQuestion === index;
  }

  isAnswered(index: number): boolean {
    return !!this.selectedAnswers[this.questionList[index - 1].id];
  }

  scrollToQuestion(index: number) {
    this.currentQuestion = index;
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  submitExam() {
    if (this.isLoading) return;

    if (this.answeredQuestions < this.totalQuestions) {
      if (
        !confirm(
          `You have answered ${this.answeredQuestions} out of ${this.totalQuestions} questions. Are you sure you want to submit?`
        )
      ) {
        return;
      }
    }

    this.isLoading = true;

    // Calculate obtained marks (you'll need to implement this logic)
    const obtainedMarks = this.calculateObtainedMarks();
    const endTime = new Date();

    // Prepare paper data

    this.authService.me().subscribe((user) => {
      const paperData = {
        startTime: this.startTime,
        endTime: endTime,
        obtainedMarks: obtainedMarks,
        studentId: user.id,
        examId: this.examId,
      };
      // this.paperService.createPaper(paperData).subscribe({
      //   next: (response) => {
      //     this.isLoading = false;
      //     this.router.navigate(['/student/exam/result'], {
      //       queryParams: { paperId: response.id },
      //       state: { resultData: response },
      //     });
      //   },
      //   error: (error) => {
      //     console.error('Error submitting paper', error);
      //     this.isLoading = false;
      //     alert('Error submitting paper. Please try again.');
      //   },
      // });
    });
  }

  private calculateObtainedMarks(): number {
    // Implement your logic to calculate marks based on selected answers
    let marks = 0;
    this.questionList.forEach((question) => {
      if (this.selectedAnswers[question.id] === question.correctAnswer) {
        marks += question.marks;
      }
    });
    return marks;
  }

  private getAttemptNumber(): number {
    // You might want to fetch this from the enrollment or count previous attempts
    return 1; // Default to 1, implement your logic here
  }


  onAnswerSelect(questionId: number, selectedOption: string): void {
    // this.selectedAnswers[questionId] = selectedOption;
    // console.log(`Question ${questionId} answered: ${selectedOption}`);
    
    // // Optionally save to backend immediately for auto-save functionality
    // this.autoSaveAnswer(questionId, selectedOption);
  }

  canSubmitExam(): boolean {
    // Allow submit even if not all questions are answered
    // You can change this to require all questions: return this.answeredQuestions === this.totalQuestions;
    return this.answeredQuestions > 0;
  }

  getAnsweredCount(): number {
    return this.answeredQuestions;
  }
}
