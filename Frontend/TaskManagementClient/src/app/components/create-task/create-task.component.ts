import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, CreateTaskDto } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  taskForm: CreateTaskDto = {
    title: '',
    description: '',
    status: 'Pending',
    dueDate: ''
  };

  loading = false;
  error = '';
  submitted = false;
  statusOptions = ['Pending', 'InProgress', 'Completed', 'Cancelled'];
  isAdmin = false;
  user: any;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    // Check if user is admin
    const roles = this.user?.roles || [];
    this.isAdmin = roles.some((role: string) => role === 'Admin' || role === 'SuperAdmin');
  }

  ngOnInit(): void {
    if (!this.isAdmin) {
      this.error = 'Only administrators can create tasks';
      setTimeout(() => this.router.navigate(['/dashboard']), 2000);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (!this.taskForm.title || this.taskForm.title.trim() === '') {
      this.error = 'Title is required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.taskService.createTask(this.taskForm).subscribe({
      next: (response: any) => {
        this.router.navigate(['/tasks']);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to create task';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
