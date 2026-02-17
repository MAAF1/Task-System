import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskDto } from '../../shared/models/create-task.dto';
import { TaskDetailDto } from '../../shared/models/task-detaildto';
import { UpdateTaskDto } from '../../shared/models/update.task.dto';
import { TaskResponseDto } from '../../shared/models/task.response.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskItemService {
  private baseUrl = environment.apiUrl + '/tasks';
  private userTaskAssignmentUrl = environment.apiUrl + '/taskassignments';
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskResponseDto[]> {
    return this.http.get<TaskResponseDto[]>(`${this.baseUrl}`);
  }

  getTaskById(taskId: number): Observable<TaskResponseDto> {
    return this.http.get<TaskResponseDto>(`${this.baseUrl}/getbyid/${taskId}`);
  }
  

  addTask(taskData: CreateTaskDto): Observable<string> {
  return this.http.post(`${this.baseUrl}`, taskData, { responseType: 'text' });
}

  updateTask(taskId: number, taskData: UpdateTaskDto): Observable<TaskResponseDto> {
    return this.http.put<TaskResponseDto>(`${this.baseUrl}/${taskId}`, taskData);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${taskId}`);
  }

  assignTask(taskId: number, userId: number): Observable<any> {
  
  const payload = { userIds: [Number(userId)] }; 
  return this.http.post(`${this.userTaskAssignmentUrl}/${taskId}/assign`, payload);
}

  removeAssignment(taskId: number, userId: number): Observable<any> {
  
  return this.http.delete(`${this.userTaskAssignmentUrl}/${taskId}/users`, { 
    body: { userIds: [Number(userId)] } 
  });
}

  searchTasks(query: string): Observable<TaskResponseDto[]> {
    return this.http.get<TaskResponseDto[]>(`${this.baseUrl}/search?query=${encodeURIComponent(query)}`);
  }


}
