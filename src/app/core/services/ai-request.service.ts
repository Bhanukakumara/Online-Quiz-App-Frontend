import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AiRequestService{

  constructor(private http:HttpClient, private authService:AuthService) { }
  
  
  sendAiRequest(studentId: number) {
    return this.http.get(`http://localhost:8080/api/paper/get-ai-request/:${studentId}`);
  }

}
