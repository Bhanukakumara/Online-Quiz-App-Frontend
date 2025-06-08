import { Component, OnInit, ViewChild } from '@angular/core';
import { Question } from '../../../core/models/question';
import { QuestionService } from '../../../core/services/question.service';
import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-question',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-add-question.component.html',
  styleUrl: './admin-add-question.component.css'
})
export class AdminAddQuestionComponent implements OnInit {
  newQuestion: Question = new Question('', '', '', '', '', 0, 0, 0, 0, 0);
  examList: any[] = [];
  userId: number = 0;
  userName: string = '';

  @ViewChild('questionForm') questionForm!: NgForm;

  constructor(
    private questionService: QuestionService,
    private examService: ExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examService.getAllExams().subscribe({
      next: (response) => {
        this.examList = response;
      },
      error: (error) => {
        console.error('Error fetching exams', error);
        Swal.fire('Error', 'Failed to load exams. Please try again later.', 'error');
      }
    });
    
    this.authService.me().subscribe({
      next: (response) => {
        this.userId = response.id;
        this.userName = response.name;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        Swal.fire('Error', 'Failed to fetch user data. Please try again later.', 'error');
      }
    });
  }

  onSubmit(form: NgForm) {
    
    if (form.valid) {
      const questionToCreate = new Question(
        form.value.text,
        form.value.option1,
        form.value.option2,
        form.value.option3,
        form.value.option4,
        form.value.correctOption,
        form.value.timeToAnswer,
        form.value.marks,
        form.value.examId,
        this.userId
      );
      
      this.questionService.createQuestion(questionToCreate).subscribe({
        next: () => {
          form.reset();
          Swal.fire('Success', 'Question added successfully!', 'success');
        },
        error: (error) => {
          console.error('Error adding question', error);
          Swal.fire('Error', 'Failed to add question. Please try again later.', 'error');
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}