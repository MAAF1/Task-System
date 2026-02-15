import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  myTasks: Task[] = [];
  loading = false;
  error = '';
  user: any;
  isAdmin = false;

  statistics = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
    console.log('Dashboard constructor - Current user:', this.user);
    console.log('Dashboard constructor - User roles:', this.user?.roles);
    if (!this.user) {
      console.log('No user found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    console.log('Dashboard init - User:', this.user);
    console.log('Dashboard init - User Roles:', this.user?.roles);
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = '';
    const userRoles = this.user?.roles || [];
    
    console.log('loadTasks - Roles:', userRoles);
    console.log('loadTasks - Roles type:', typeof userRoles);
    
    this.isAdmin = userRoles.some((role: string) => {
      const isMatch = role === 'Admin' || role === 'SuperAdmin';
      console.log('Checking role:', role, 'isMatch:', isMatch);
      return isMatch;
    });
    
    console.log('loadTasks - isAdmin:', this.isAdmin);
    console.log('User object:', JSON.stringify(this.user, null, 2));
    
    if (this.isAdmin) {
      // Admin/SuperAdmin users - first try SP endpoint, fall back to getAllTasks
      console.log('Loading tasks for admin/superadmin');
      
      this.taskService.getAllTasksDetailsFromSP().subscribe({
        next: (tasks: any[]) => {
          console.log('All tasks details loaded from SP:', tasks);
          this.tasks = tasks || [];
          this.calculateStatistics();
          this.loading = false;
        },
        error: (spErr: any) => {
          console.warn('SP endpoint failed, falling back to getAllTasks:', spErr);
          
          // Fallback to regular getAllTasks
          this.taskService.getAllTasks().subscribe({
            next: (tasks: any[]) => {
              console.log('All tasks loaded (fallback):', tasks);
              this.tasks = tasks || [];
              this.calculateStatistics();
              this.loading = false;
            },
            error: (allTasksErr: any) => {
              console.error('Error loading all tasks (fallback also failed):', allTasksErr);
              this.error = 'Failed to load tasks. Please try refreshing the page.';
              this.tasks = [];
              this.loading = false;
            }
          });
        }
      });
    } else {
      // Regular users see only their assigned tasks
      console.log('Loading my tasks for regular user');
      this.taskService.getMyTasks().subscribe({
        next: (myTasks: any[]) => {
          console.log('My tasks loaded:', myTasks);
          this.tasks = myTasks || [];
          this.calculateStatistics();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading my tasks:', err);
          // Handle 404 as "no tasks" instead of error
          if (err.status === 404) {
            console.log('No tasks found for user (404 response)');
            this.tasks = [];
            this.calculateStatistics();
            this.loading = false;
          } else {
            this.error = 'Failed to load your tasks. Please try refreshing the page.';
            this.tasks = [];
            this.loading = false;
          }
        }
      });
    }
  }

  calculateStatistics(): void {
    this.statistics.totalTasks = this.tasks.length;
    
    // Handle multiple response formats (from SP, from getAllTasks, from getMyTasks)
    this.statistics.completedTasks = this.tasks.filter(t => {
      const status = (t as any).userStatus || (t as any).taskItemStatus || (t as any).taskStatus || t.status;
      return status === 'Completed';
    }).length;
    
    this.statistics.pendingTasks = this.tasks.filter(t => {
      const status = (t as any).userStatus || (t as any).taskItemStatus || (t as any).taskStatus || t.status;
      return status === 'Pending';
    }).length;
    
    const now = new Date();
    this.statistics.overdueTasks = this.tasks.filter(t => {
      const status = (t as any).userStatus || (t as any).taskItemStatus || (t as any).taskStatus || t.status;
      const dueDate = (t as any).taskDueDate || (t as any).userTaskDueDate || t.dueDate;
      return dueDate && new Date(dueDate) < now && status !== 'Completed';
    }).length;
  }

  getStatusBadgeClass(task: any): string {
    // Handle TaskResponseDto, MyTaskDto, and StoredProcedure response formats
    const status = task.userStatus || task.taskItemStatus || task.taskStatus || task.status;
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

  completeTask(taskId: number, task: any): void {
    if (confirm('Mark this task as completed?')) {
      this.taskService.completeUserTask(taskId).subscribe({
        next: () => {
          task.userStatus = 'Completed';
          this.calculateStatistics();
        },
        error: (err: any) => {
          alert('Failed to complete task: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  addFeedback(taskId: number): void {
    const feedback = prompt('Enter your feedback for this task:');
    if (feedback && feedback.trim()) {
      this.taskService.updateUserTaskFeedback(taskId, feedback).subscribe({
        next: () => {
          alert('Feedback added successfully!');
        },
        error: (err: any) => {
          alert('Failed to add feedback: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
