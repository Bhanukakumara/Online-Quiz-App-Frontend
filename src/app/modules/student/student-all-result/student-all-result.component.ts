import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaperService } from '../../../core/services/paper.service';
import { QuestionService } from '../../../core/services/question.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-all-result',
  imports: [CommonModule],
  templateUrl: './student-all-result.component.html',
  styleUrl: './student-all-result.component.css',
})
export class StudentAllResultComponent {
  allResult: any[] = [CommonModule];
  questionsCache: { [key: number]: any } = {}; // Cache for questions to avoid repeated API calls
  studentId: number = 0;

  constructor(
    private paperService: PaperService,
    private questionService: QuestionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.me();
  }

  me() {
    this.authService.me().subscribe({
      next: (user) => {
        this.studentId = user.id;
        this.getAllResultByStudentId();
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }
  getAllResultByStudentId() {
    this.paperService.getAllResultByStudentId(this.studentId).subscribe({
      next: (results) => {
        // Initialize expanded property for each paper
        this.allResult = results.map((paper: any) => ({
          ...paper,
          expanded: false,
          questionsLoaded: false, // Track if questions are loaded for this paper
          questionDetails: [], // Store question details for this paper
        }));
      },
      error: (error) => {
        console.error('Error fetching results:', error);
      },
    });
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
    const questionIds: any[] = [
      ...new Set(paper.studentAnswer.map((answer: any) => answer.questionId)),
    ];

    // Check which questions are not in cache
    const uncachedIds = questionIds.filter(
      (id: number) => !this.questionsCache[id]
    );

    if (uncachedIds.length > 0) {
      // Load uncached questions
      const questionRequests = uncachedIds.map((id) =>
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
        },
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
        isCorrect: answer.correctAnswer === answer.givenAnswer,
      };
    });

    paper.questionsLoaded = true;
  }

  private getAnswerText(question: any, answerNumber: number): string {
    if (!question) return 'N/A';

    switch (answerNumber) {
      case 1:
        return question.option1 || 'N/A';
      case 2:
        return question.option2 || 'N/A';
      case 3:
        return question.option3 || 'N/A';
      case 4:
        return question.option4 || 'N/A';
      default:
        return 'N/A';
    }
  }
}
