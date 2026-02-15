import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Task {
  id?: number;
  taskId?: number;
  title: string;
  description?: string;
  status?: string;
  userStatus?: string;
  taskItemStatus?: string;
  taskStatus?: string;
  dueDate?: string;
  taskDueDate?: string;
  userTaskDueDate?: string;
  createdDate?: string;
  userAssignedDate?: number;
  closedDate?: string | null;
  userTaskClosedDate?: string | null;
  createdById?: number;
  createdBy?: any;
  createdByName?: string;
  assignedUsers?: any[];
  userName?: string;
  userClosedDate?: any;
  userDueDate?: any;
  feedback?: string;
  feedBack?: string;
  assignedDate?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  status?: string;
  assignedUserIds?: number[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTasksDetailsFromSP(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllTasksDetailsFromSP`);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap((tasks) => this.tasksSubject.next(tasks))
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, task).pipe(
      tap(() => {
        // Force refresh of tasks after creation
        this.getAllTasks().subscribe();
      })
    );
  }

  updateTask(id: number, task: UpdateTaskDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => {
        // Force refresh of tasks after update
        this.getAllTasks().subscribe();
      })
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Force refresh of tasks after deletion
        this.getAllTasks().subscribe();
      })
    );
  }

  completeUserTask(taskId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/usertasks/${taskId}/complete`, {});
  }

  updateUserTaskFeedback(taskId: number, feedback: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/usertasks/${taskId}/feedback`, feedback);
  }

  assignUsersToTask(taskId: number, userIds: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/taskassignments/${taskId}/assign`, { userIds });
  }

  removeUsersFromTask(taskId: number, userIds: number[]): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/taskassignments/${taskId}/users`, { body: { userIds } });
  }

  searchTasks(title: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/search?title=${encodeURIComponent(title)}`);
  }

  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/usertasks/my`);
  }
}