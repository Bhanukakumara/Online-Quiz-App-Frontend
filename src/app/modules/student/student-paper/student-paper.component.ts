import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../core/services/question.service';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import { PaperService } from '../../../core/services/paper.service';
import { Paper } from '../../../core/models/paper';

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
  currentQuestion = 1;
  answeredQuestions = 0;
  totalQuestions = 0;
  selectedAnswers: { [key: number]: string } = {};
  startTime: Date;
  isLoading = false;
  totalMarks: number = 0;
  studentId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private paperService: PaperService,
    private questionService: QuestionService,
    private authService: AuthService
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
        this.calculateTotalMarks();
        this.loadExamDetails();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam data', error);
        this.isLoading = false;
      },
    });
  }

  calculateTotalMarks(): void {
    this.totalMarks = this.questionList.reduce((total, question) => {
      return total + (Number(question.marks) || 0);
    }, 0);
    console.log('Total Marks Calculated:', this.totalMarks); // Debug log
  }

  loadExamDetails() {
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

  onAnswerSelect(questionId: number, answer: string) {
    this.selectedAnswers[questionId] = answer;
  }

  // Convert selected answers to the required array format
  getStudentAnswersArray(): { questionId: number; givenAnswer: number }[] {
    return Object.keys(this.selectedAnswers).map((key) => {
      const questionId = parseInt(key);
      // Find the question in questionList to get the correct answer (already stored as number)
    const question = this.questionList.find(q => q.id === questionId);
    const correctAnswer = question?.correctOption;
      // Convert answer letter (A,B,C,D) to number (1,2,3,4)
      const givenAnswer =
        this.selectedAnswers[questionId].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      return { questionId, correctAnswer, givenAnswer };
    });
  }

  getAnsweredCount(): number {
    return Object.keys(this.selectedAnswers).length;
  }

  submitExam() {
    if (this.isLoading) return;

    const studentAnswers = this.getStudentAnswersArray();
    
    if (this.answeredQuestions < this.totalQuestions) {
      if (
        !confirm(
          `You have answered ${studentAnswers.length} out of ${this.totalQuestions} questions. Are you sure you want to submit?`
        )
      ) {
        return;
      }
    }

    this.isLoading = true;
    const endTime = new Date();

    // Prepare paper data

    this.authService.me().subscribe((user) => {
      const paperData = {
        studentId: user.id,
        examId: this.examId,
        totalMarks: this.totalMarks,
        endTime: endTime,
        startTime: this.startTime,
        studentAnswers: studentAnswers,
      };

      // Save the paper
      this.paperService.savePaper(paperData).subscribe({
        next: () => {
          alert('Exam submitted successfully!');
          this.router.navigate([`/student/view-all-result/${user.id}`]);
        },
        error: (error) => {
          console.error('Error submitting exam', error);
          alert('Error submitting exam. Please try again.');
          this.isLoading = false;
        },
      });
    });
  }
}
