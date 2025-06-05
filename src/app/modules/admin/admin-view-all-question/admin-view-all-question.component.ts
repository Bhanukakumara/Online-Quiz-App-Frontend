import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../core/services/question.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-view-all-question',
  imports: [CommonModule],
  templateUrl: './admin-view-all-question.component.html',
  styleUrl: './admin-view-all-question.component.css'
})
export class AdminViewAllQuestionComponent implements OnInit {
  constructor(private questionService: QuestionService){}
  questions: any[] = [];
  ngOnInit(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (response) => {
        this.questions = response;
      },
      error: (error) => {
        console.error('Error fetching questions', error);
        alert('Error fetching questions. Please try again.');
      }
    });
  }
}
