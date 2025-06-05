import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-view-all-exam',
  imports: [CommonModule],
  templateUrl: './admin-view-all-exam.component.html',
  styleUrl: './admin-view-all-exam.component.css'
})
export class AdminViewAllExamComponent implements OnInit {
  exams: any[] = [];

  constructor(private examService: ExamService) {}

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
        alert('Error fetching exams. Please try again.');
      }
    });
  }
}
