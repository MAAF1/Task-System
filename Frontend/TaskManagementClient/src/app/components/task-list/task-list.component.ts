import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, CreateTaskDto } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  filterStatus = 'All';
  searchQuery = '';
  sortBy = 'createdDate';
  isAdmin = false;
  user: any;

  statusOptions = ['All', 'Pending', 'InProgress', 'Completed', 'Cancelled'];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
    const roles = this.user?.roles || [];
    this.isAdmin = roles.some((role: string) => role === 'Admin' || role === 'SuperAdmin');
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.tasks];

    // Filter by status
    if (this.filterStatus !== 'All') {
      filtered = filtered.filter(t => t.status === this.filterStatus);
    }

    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
          return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
        case 'createdDate':
        default:
          return new Date(b.createdDate || '').getTime() - new Date(a.createdDate || '').getTime();
      }
    });

    this.filteredTasks = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'InProgress': return 'primary';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId, 'edit']);
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err: any) => console.error('Error deleting task:', err)
      });
    }
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/create']);
  }
}
