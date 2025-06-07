import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUserCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/user/total-count');
  }
  getCourseCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/course/total-count');
  }
  getExamCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/exam/total-count');
  }
  getQuestionCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/question/total-count');
  }
  getAdminCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/user/total-admin-count');
  }
  getTeacherCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/user/total-teacher-count');
  }
  getStudentCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/user/total-student-count');
  } 
}
