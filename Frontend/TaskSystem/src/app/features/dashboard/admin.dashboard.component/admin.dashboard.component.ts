import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TaskItemService } from '../../../core/services/task.item.service';
import { TaskResponseDto } from '../../../shared/models/task.response.dto';
import { Auth } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-admin.dashboard.component',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.dashboard.component.html',
  styleUrl: './admin.dashboard.component.css',
  standalone: true
})
export class AdminDashboardComponent implements OnInit {

  tasks: TaskResponseDto[] = [];
  loading = true;
  error ?: string

  constructor(private taskItemService: TaskItemService, private router: Router, public authService: Auth, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(){
    this.loading = true;
    this.taskItemService.getAllTasks().subscribe({
      next : (tasks) =>{
        this.tasks = tasks;
        this.loading = false;
        this.cdr.detectChanges();

      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;}});
  }

  openTask(taskId: number) {
    this.router.navigate(['/admintaskdetail/', taskId]);
  }
}
