import { Component, OnInit, signal } from '@angular/core';
import { TaskItemService } from '../../../core/services/task.item.service';
import { TaskResponseDto } from '../../../shared/models/task.response.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-all-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.css',
})
export class AllTasks implements OnInit {
  tasks = signal<TaskResponseDto[]>([]);
  loading = signal(true)
  searchQuery = signal('');  
  selectedTask = signal<TaskResponseDto | null>(null);
    constructor(private taskItemService: TaskItemService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void{
    this.loading.set(true);
    this.taskItemService.getAllTasks().subscribe({
      next: (tasks) =>{
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      }
    })
  }

  search(): void {
    if (!this.searchQuery().trim()) {
      this.loadTasks();
      return;
    }

    this.taskItemService.searchTasks(this.searchQuery()).subscribe({
      next: tasks => this.tasks.set(tasks),
      error: console.error
    });
  }

  
}
    

/* deleteTask(task: TaskDetailDto): void {
    if (!confirm('Are you sure?')) return;

    this.taskItemService.searchTasks(task.title).subscribe({
      next: res => {
        this.taskItemService.deleteTask(res.taskId).subscribe({
          next: () => this.loadTasks(),
          error: console.error
        });
      },
      error: console.error
    });
  } */