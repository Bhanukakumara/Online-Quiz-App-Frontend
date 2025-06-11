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
  styleUrl: './admin-view-all-exam.component.css'
})
export class AdminViewAllExamComponent implements OnInit {
  exams: any[] = [];

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAllExams().subscribe({
      next: (response) => {
        this.exams = response;
      },
      error: (error) => {
        console.error('Error fetching exams', error);
        Swal.fire('Error', 'Failed to load exams. Please try again later.', 'error');
        
      }
    });
  }

  updateExam(examId: number){
    console.log('update exam With Id:', examId);
    this.router.navigate(['admin/update-exam', examId]);
  }

}
