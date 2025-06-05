import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  createCourse(course: Course): Observable<any>{
    return this.http.post('http://localhost:8080/api/course/create', course);
  }
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/course/get-all');
  }
}
