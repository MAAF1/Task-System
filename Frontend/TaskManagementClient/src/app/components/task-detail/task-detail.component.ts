import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task, UpdateTaskDto } from '../../services/task.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  loading = false;
  editing = false;
  editForm: UpdateTaskDto = {};
  users: User[] = [];
  statusOptions = ['Pending', 'InProgress', 'Completed', 'Cancelled'];
  message = '';
  error = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTask();
    this.loadUsers();
  }

  loadTask(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.loading = true;
    this.taskService.getTaskById(+id).subscribe({
      next: (task: any) => {
        this.task = task;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading task:', err);
        this.error = 'Failed to load task';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.users = users;
      },
      error: (err: any) => console.error('Error loading users:', err)
    });
  }

  startEdit(): void {
    if (!this.task) return;
    this.editForm = {
      title: this.task.title,
      description: this.task.description,
      status: this.task.status,
      dueDate: this.task.dueDate
    };
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    this.editForm = {};
    this.message = '';
    this.error = '';
  }

  saveChanges(): void {
    if (!this.task?.id) return;

    this.loading = true;
    this.taskService.updateTask(this.task.id, this.editForm).subscribe({
      next: (updatedTask: any) => {
        this.task = updatedTask;
        this.editing = false;
        this.message = 'Task updated successfully!';
        this.loading = false;
        setTimeout(() => (this.message = ''), 3000);
      },
      error: (err: any) => {
        this.error = 'Failed to update task';
        this.loading = false;
      }
    });
  }

  completeTask(): void {
    if (!this.task?.id) return;

    this.loading = true;
    this.taskService.completeUserTask(this.task.id).subscribe({
      next: () => {
        this.message = 'Task completed successfully!';
        setTimeout(() => this.router.navigate(['/tasks']), 1500);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to complete task';
        this.loading = false;
      }
    });
  }

  deleteTask(): void {
    if (!this.task?.id || !confirm('Are you sure you want to delete this task?')) return;

    this.loading = true;
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.message = 'Task deleted successfully!';
        setTimeout(() => this.router.navigate(['/tasks']), 1500);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to delete task';
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'InProgress': return 'primary';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
