import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthPanelComponent } from './components/auth-panel/auth-panel.component';
import { AdminTasksPanelComponent } from './components/admin-tasks-panel/admin-tasks-panel.component';
import { UserTasksPanelComponent } from './components/user-tasks-panel/user-tasks-panel.component';
import {
  AuthRequest,
  CreateTaskRequest,
  LoginResponse,
  MyTaskItem,
  TaskItem,
  UpdateTaskRequest
} from './models/task.models';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AuthPanelComponent, AdminTasksPanelComponent, UserTasksPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authMode: 'login' | 'register' = 'login';
  authForm: AuthRequest = { email: '', password: '', userName: '' };

  taskForm: CreateTaskRequest = {
    title: '',
    description: '',
    dueDate: null,
    status: 'Pending',
    assignedUserIds: []
  };

  tasks: TaskItem[] = [];
  myTasks: MyTaskItem[] = [];
  feedbackDrafts: Record<number, string> = {};

  assignedUsersInput = '';
  searchTitle = '';
  roles: string[] = [];
  username = '';

  authMessage = '';
  taskMessage = '';

  constructor(private readonly taskService: TaskService) {
    this.restoreSession();
  }

  get canManageTasks(): boolean {
    return this.roles.includes('Admin') || this.roles.includes('SuperAdmin');
  }

  get canDeleteTask(): boolean {
    return this.roles.includes('SuperAdmin');
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('task_system_token');
  }

  setMode(mode: 'login' | 'register'): void {
    this.authMode = mode;
    this.authMessage = '';
  }

  submitAuth(): void {
    this.authMessage = '';
    if (!this.authForm.email || !this.authForm.password) {
      this.authMessage = 'Email and password are required.';
      return;
    }

    if (this.authMode === 'register') {
      if (!this.authForm.userName?.trim()) {
        this.authMessage = 'Username is required for registration.';
        return;
      }

      this.taskService.register(this.authForm).subscribe({
        next: (res) => {
          this.authMessage = `${res.message}. Please login with your new account.`;
          this.authMode = 'login';
          this.authForm.password = '';
        },
        error: (err) => {
          this.authMessage = err?.error?.message ?? 'Registration failed.';
        }
      });
      return;
    }

    this.taskService.login(this.authForm).subscribe({
      next: (res) => this.handleLoginSuccess(res),
      error: (err) => {
        this.authMessage = err?.error?.message ?? 'Login failed. Check credentials.';
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.taskMessage = '';
      },
      error: () => {
        this.taskMessage = 'Could not load task list. Check permissions/token.';
      }
    });
  }

  loadMyTasks(): void {
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.myTasks = tasks;
      },
      error: () => {
        this.myTasks = [];
      }
    });
  }

  searchTasks(): void {
    if (!this.searchTitle.trim()) {
      this.loadTasks();
      return;
    }

    this.taskService.searchTasks(this.searchTitle.trim()).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.taskMessage = '';
      },
      error: () => {
        this.tasks = [];
        this.taskMessage = 'No tasks found with that title.';
      }
    });
  }

  createTask(): void {
    if (!this.taskForm.title.trim()) {
      this.taskMessage = 'Task title is required.';
      return;
    }

    const assignedIds = this.parseAssignedIds();
    if (assignedIds === null) {
      this.taskMessage = 'Assigned users must be comma-separated numeric IDs.';
      return;
    }

    const request: CreateTaskRequest = {
      ...this.taskForm,
      title: this.taskForm.title.trim(),
      description: this.taskForm.description?.trim() || null,
      dueDate: this.taskForm.dueDate || null,
      assignedUserIds: assignedIds
    };

    this.taskService.createTask(request).subscribe({
      next: (msg) => {
        this.taskMessage = msg || 'Task created successfully.';
        this.taskForm = {
          title: '',
          description: '',
          dueDate: null,
          status: 'Pending',
          assignedUserIds: []
        };
        this.assignedUsersInput = '';
        this.loadTasks();
      },
      error: (err) => {
        this.taskMessage = err?.error ?? 'Task creation failed.';
      }
    });
  }

  markCompleted(task: TaskItem): void {
    const request: UpdateTaskRequest = { status: 'Completed' };

    this.taskService.updateTask(task.taskId, request).subscribe({
      next: () => this.loadTasks(),
      error: () => {
        this.taskMessage = 'Unable to mark task completed.';
      }
    });
  }

  completeMyTask(taskId: number): void {
    this.taskService.completeMyTask(taskId).subscribe({
      next: () => this.loadMyTasks(),
      error: () => {
        this.taskMessage = 'Unable to complete your task.';
      }
    });
  }

  updateFeedbackDraft(taskId: number, value: string): void {
    this.feedbackDrafts[taskId] = value;
  }

  saveMyFeedback(taskId: number): void {
    const value = this.feedbackDrafts[taskId]?.trim();
    if (!value) {
      this.taskMessage = 'Feedback cannot be empty.';
      return;
    }

    this.taskService.updateMyTaskFeedback(taskId, value).subscribe({
      next: () => {
        this.taskMessage = 'Feedback saved.';
        this.loadMyTasks();
      },
      error: () => {
        this.taskMessage = 'Failed to save feedback.';
      }
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.taskMessage = 'Task deleted.';
        this.loadTasks();
      },
      error: () => {
        this.taskMessage = 'Delete failed. SuperAdmin role is required.';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('task_system_token');
    localStorage.removeItem('task_system_roles');
    localStorage.removeItem('task_system_username');
    this.roles = [];
    this.username = '';
    this.tasks = [];
    this.myTasks = [];
    this.feedbackDrafts = {};
    this.taskMessage = '';
  }

  private parseAssignedIds(): number[] | null {
    if (!this.assignedUsersInput.trim()) {
      return [];
    }

    const parsed = this.assignedUsersInput
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => Number(v));

    return parsed.some((id) => Number.isNaN(id)) ? null : parsed;
  }

  private handleLoginSuccess(response: LoginResponse): void {
    localStorage.setItem('task_system_token', response.token);
    localStorage.setItem('task_system_roles', JSON.stringify(response.roles));
    localStorage.setItem('task_system_username', response.username);
    this.roles = response.roles;
    this.username = response.username;
    this.authMessage = `Welcome back, ${response.username}.`;
    this.authForm.password = '';

    if (this.canManageTasks) {
      this.loadTasks();
    }

    this.loadMyTasks();
  }

  private restoreSession(): void {
    const roles = localStorage.getItem('task_system_roles');
    this.roles = roles ? (JSON.parse(roles) as string[]) : [];
    this.username = localStorage.getItem('task_system_username') ?? '';

    if (this.isAuthenticated) {
      if (this.canManageTasks) {
        this.loadTasks();
      }
      this.loadMyTasks();
    }
  }
}
