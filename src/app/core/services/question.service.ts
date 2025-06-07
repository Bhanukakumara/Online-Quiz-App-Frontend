import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../models/question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http:HttpClient) { }

  createQuestion(question:Question): Observable<any>{
    return this.http.post('http://localhost:8080/api/question/create',question);
  }

  getAllQuestions(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/question/get-all');
  }

  getQuestionPaperByExamId(examId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/question/get-question-paper-by-examId/${examId}`);
  }

  getQuestionByExamId(examId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/question/get-by-examId/${examId}`);
  }

  getQuestionById(questionId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/question/get-by-id/${questionId}`);
  }
}
