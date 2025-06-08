import { Injectable } from '@angular/core';
import { AiRequestDto } from '../models/ai-request-dto';

@Injectable({
  providedIn: 'root',
})
export class AiFeedbackService {
  constructor() {}

  getSummary(aiRequest: AiRequestDto): string {
    let summary = `<strong>You have obtained ${aiRequest.obtainedMarks} out of ${aiRequest.totalMarks} marks.</strong><br><br>`;
    summary += '<strong>Correct Answers:</strong><ul>';
    aiRequest.questions.forEach((question, index) => {
      summary += `<li><strong>Q:</strong> ${question}<br><strong>A:</strong> ${aiRequest.correctAnswer[index]}</li>`;
    });
    summary += '</ul>';

    return summary;
  }
}
