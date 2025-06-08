import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AiRequestDto } from '../models/ai-request-dto';

@Injectable({
  providedIn: 'root'
})
export class AiRequestService{

  constructor(private http:HttpClient, private authService:AuthService) { }
  sendAiRequest(studentId: number):Observable<AiRequestDto> {
    return this.http.get<AiRequestDto>(`http://localhost:8080/api/paper/get-ai-request/${studentId}`);
  }

}
