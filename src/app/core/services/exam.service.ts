import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exam } from '../models/exam';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http:HttpClient) { }

  createExam(exam:Exam): Observable<any>{
    return this.http.post('http://localhost:8080/api/exam/create', exam);
  }

  getAllExams(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/exam/get-all');
  }

  getExamById(examId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/exam/get-by-id/${examId}`);
  }
}
