import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTaskRequest, TaskItem, TaskStatus } from './models/task.models';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App {
  private readonly tasksSignal = signal<TaskItem[]>([]);
  readonly filterStatus = signal<TaskStatus | 'All'>('All');
  readonly filterAssignee = signal('');

  readonly form: CreateTaskRequest = {
    title: '',
    description: '',
    status: 'Pending',
    dueDate: null,
    assignedToUserId: ''
  };

  readonly errorMessage = signal('');

  readonly filteredTasks = computed(() => {
    const status = this.filterStatus();
    const assignee = this.filterAssignee().trim();
    return this.tasksSignal().filter((task) => {
      const statusMatches = status === 'All' || task.status === status;
      const assigneeMatches = !assignee || task.assignedToUserId === assignee;
      return statusMatches && assigneeMatches;
    });
  });

  constructor(private readonly taskService: TaskService) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasksSignal.set(tasks),
      error: () => this.errorMessage.set('Unable to load tasks. Check the API connection.')
    });
  }

  submitTask(): void {
    this.errorMessage.set('');
    if (!this.form.title.trim()) {
      this.errorMessage.set('Title is required.');
      return;
    }

    if (this.form.title.length > 100) {
      this.errorMessage.set('Title must be 100 characters or less.');
      return;
    }

    const request: CreateTaskRequest = {
      ...this.form,
      title: this.form.title.trim(),
      assignedToUserId: this.form.assignedToUserId?.trim() || null,
      description: this.form.description?.trim() || null
    };

    this.taskService.createTask(request).subscribe({
      next: (created) => {
        this.tasksSignal.update((tasks) => [created, ...tasks]);
        this.form.title = '';
        this.form.description = '';
        this.form.status = 'Pending';
        this.form.dueDate = null;
        this.form.assignedToUserId = '';
      },
      error: () => this.errorMessage.set('Unable to create task. Please review the form.')
    });
  }

  markCompleted(task: TaskItem): void {
    const update = {
      title: task.title,
      description: task.description,
      status: 'Completed' as TaskStatus,
      dueDate: task.dueDate,
      assignedToUserId: task.assignedToUserId
    };

    this.taskService.updateTask(task.id, update).subscribe({
      next: () => {
        this.tasksSignal.update((tasks) =>
          tasks.map((item) => (item.id === task.id ? { ...item, status: 'Completed' } : item))
        );
      },
      error: () => this.errorMessage.set('Unable to update task status.')
    });
  }

  deleteTask(task: TaskItem): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasksSignal.update((tasks) => tasks.filter((item) => item.id !== task.id));
      },
      error: () => this.errorMessage.set('Unable to delete task.')
    });
  }
}
