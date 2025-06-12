import { Component, OnInit, ViewChild } from '@angular/core';
import { Question } from '../../../core/models/question';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../core/services/question.service';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-update-question',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-update-question.component.html',
  styleUrl: './admin-update-question.component.css'
})
export class AdminUpdateQuestionComponent implements OnInit {
   questionEditing: Question = {
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctOption: 0,
    timeToAnswer: 0,
    marks: 0,
    examId: 0,
    teacherId: 0
  };

  examList: any[] = [];
  userId: number = 0;
  userName: string = '';
  questionId: number = 0;

  @ViewChild('questionForm') questionForm!: NgForm;

  constructor(
    private readonly questionService: QuestionService,
    private readonly examService: ExamService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const questionIdParam = this.route.snapshot.paramMap.get('questionId');
    this.questionId = questionIdParam ? +questionIdParam : 0;

    this.examService.getAllExams().subscribe({
          next: (response) => {
            this.examList = response;           
          },
          error: (error) => {
            console.error('Error fetching exams', error);
            Swal.fire('Error', 'Failed to load exams. Please try again later.', 'error');
          }
        });

    if (this.questionId) {
      this.questionService.getQuestionById(this.questionId).subscribe({
        next: (res) => {
          this.questionEditing = res;
        },
        error: (error) => {
          console.error('Error fetching question data', error);
          Swal.fire('Error', 'Failed to fetch question data. Please try again later.', 'error');
        }
      });
    }
    
    this.authService.me().subscribe({
      next: (response) => {
        this.userId = response.id;
        this.userName = response.name;
      },
      error: (error) => {
        console.error('Error fetching question data', error);
        Swal.fire('Error', 'Failed to fetch question data. Please try again later.', 'error');
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.questionId) {
      const questionToSave: Question = {
        text: form.value.text,
        option1: form.value.option1,
        option2: form.value.option2,
        option3: form.value.option3,
        option4: form.value.option4,
        correctOption: +form.value.correctOption,
        timeToAnswer: +form.value.timeToAnswer,
        marks: +form.value.marks,
        examId: +form.value.examId,
        teacherId: this.userId
      };

      this.questionService.updateQuestionById(this.questionId, questionToSave).subscribe({
        next: () => {
          Swal.fire('Success', 'Question updated successfully!', 'success').then(() => {
            this.router.navigate(['/admin/view-all-question']);
          });
        },
        error: (error) => {
          console.error('Error updating question', error);
          Swal.fire('Error', 'Failed to update question. Please try again later.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Form is invalid or question ID is missing. Please try again.', 'error');
    }
  }
}
