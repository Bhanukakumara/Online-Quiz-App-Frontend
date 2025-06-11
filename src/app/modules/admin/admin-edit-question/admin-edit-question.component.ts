import { Component, OnInit, ViewChild } from '@angular/core';
import { Question } from '../../../core/models/question';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../core/services/question.service';
import { ExamService } from '../../../core/services/exam.service';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-edit-question',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-edit-question.component.html',
  styleUrl: './admin-edit-question.component.css'
})
export class AdminEditQuestionComponent implements OnInit {
  questionEditing = {
    text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctOption: null,
    timeToAnswer: null,
    marks: null,
    examId: null
  };

  examList: any[] = [];
  userId: number = 0;
  userName: string = '';
  questionId!: string;

  @ViewChild('questionForm') questionForm!: NgForm;

  constructor(
    private readonly questionService: QuestionService,
    private readonly examService: ExamService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.questionId = this.route.snapshot.paramMap.get('questionId')!;

    this.examService.getAllExams().subscribe({
          next: (response) => {
            this.examList = response;           
          },
          error: (error) => {
            console.error('Error fetching exams', error);
            Swal.fire('Error', 'Failed to load exams. Please try again later.', 'error');
          }
        });

    // back-end mapping url should be amended
    this.questionService.getQuestionById(+this.questionId).subscribe({
      next: res => {
        console.log(res);
        this.questionEditing = res;
      }
    })
    
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
    
    if (form.valid) {
      const questionToSave = new Question(
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

      console.log(questionToSave);
      
      
      // this.questionService.createQuestion(questionToSave).subscribe({
      //   next: () => {
      //     form.reset();
      //     Swal.fire('Success', 'Question added successfully!', 'success');
      //   },
      //   error: (error) => {
      //     console.error('Error adding question', error);
      //     Swal.fire('Error', 'Failed to add question. Please try again later.', 'error');
      //   },
      // });
    } else {
      console.log('Form is invalid');
    }
  }

}
