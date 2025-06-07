import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paper } from '../models/paper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  constructor(private http:HttpClient) { }

  createPaper(paper: Paper): Observable<any>{
    return this.http.post('http://localhost:8080/api/paper/create', paper);
  }

  savePaper(savePaper: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/paper/save', savePaper);
  }
  getAllResult(): Observable<any> {
    return this.http.get('http://localhost:8080/api/paper/get-all-answer')
  }
}
