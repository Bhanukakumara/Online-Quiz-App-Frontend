import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enrollment } from '../models/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  
  constructor(private http:HttpClient) { }

  createEnrollment(enrollment: Enrollment) {
    return this.http.post('http://localhost:8080/api/enrollment/create', enrollment);
  }
}
