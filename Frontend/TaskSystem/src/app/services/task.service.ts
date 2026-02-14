import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import {
  AuthRequest,
  CreateTaskRequest,
  LoginResponse,
  MyTaskItem,
  RegisterResponse,
  TaskItem,
  UpdateTaskRequest
} from '../models/task.models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(request: AuthRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request);
  }

  register(request: AuthRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, request);
  }

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() });
  }

  searchTasks(title: string): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/tasks/search`, {
      headers: this.getAuthHeaders(),
      params: { title }
    });
  }

  getMyTasks(): Observable<MyTaskItem[]> {
    return this.http.get<MyTaskItem[]>(`${this.apiUrl}/usertasks/my`, { headers: this.getAuthHeaders() });
  }

  completeMyTask(taskId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/usertasks/${taskId}/complete`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  updateMyTaskFeedback(taskId: number, feedback: string): Observable<{ message: string; feedback: string }> {
    return this.http.put<{ message: string; feedback: string }>(`${this.apiUrl}/usertasks/${taskId}/feedback`, JSON.stringify(feedback), {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  createTask(request: CreateTaskRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/tasks`, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  updateTask(id: number, request: UpdateTaskRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tasks/${id}`, request, { headers: this.getAuthHeaders() });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('task_system_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
