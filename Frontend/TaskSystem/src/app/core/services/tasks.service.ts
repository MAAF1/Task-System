import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyTaskDto } from '../../shared/models/mytask.dto';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserTasksService {
  private baseUrl = environment.apiUrl + '/usertasks';

  constructor(private http: HttpClient) {}

  getMyTasks(): Observable<MyTaskDto[]> {
    return this.http.get<MyTaskDto[]>(`${this.baseUrl}/my`);
  }

  completeTask(taskId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${taskId}/complete`, {});
  }

  updateFeedback(taskId: number, feedback: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${taskId}/feedback`, { feedback });
  }

}
