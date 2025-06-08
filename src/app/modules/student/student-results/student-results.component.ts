import { Component, OnInit } from '@angular/core';
import { PaperService } from '../../../core/services/paper.service';

@Component({
  selector: 'app-student-results',
  imports: [],
  templateUrl: './student-results.component.html',
  styleUrl: './student-results.component.css'
})
export class StudentResultsComponent implements OnInit {
  constructor(private paperService:PaperService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
