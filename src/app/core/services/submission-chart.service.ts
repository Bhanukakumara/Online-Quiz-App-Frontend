import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChartDataPoint {
  time: string;
  timestamp: number;
  count: number;
}

export interface LiveSubmissionData {
  currentMinuteCount: number;
  todayTotal: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionChartService {
  private apiUrl = 'http://localhost:8080/api/paper'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getSubmissionsByMinute(minutes: number = 60): Observable<ChartDataPoint[]> {
    return this.http.get<ChartDataPoint[]>(`${this.apiUrl}/submissions-by-minute?minutes=${minutes}`);
  }

  getLiveSubmissions(): Observable<LiveSubmissionData> {
    return this.http.get<LiveSubmissionData>(`${this.apiUrl}/live-submissions`);
  }
}
