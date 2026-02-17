import { Component, Input, OnInit } from '@angular/core';
import { MyTaskDto } from '../../../shared/models/mytask.dto';
import { Status } from '../../../shared/models/status.enum';
import { UserTasksService } from '../../../core/services/tasks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task.details.component.html',
  styleUrl: './task.details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  private _task!: MyTaskDto;
  feedbackInput: string = '';
  TaskStatus = Status;

  @Input() 
  set task(value: any) {
    if (value) {
      // فك المصفوفة اللي جاية من الـ Dashboard
      this._task = Array.isArray(value) ? value[0] : value;
      this.feedbackInput = this._task?.feedback || '';
    }
  }
  get task(): MyTaskDto { return this._task; }

  constructor(
    private tasksService: UserTasksService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // الطريقة المضمونة لقراءة الـ State في Angular
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.task = navigation.extras.state['data']; 
    }
  }

  ngOnInit(): void {
    // لو لسبب ما الـ Constructor ملحقش (زي في حالات معينة)، بنجرب هنا برضه
    if (!this.task) {
      const stateData = window.history.state?.data;
      if (stateData) {
        this.task = stateData;
      }
    }
  }

  completeTask() {
    if (!this.task) return;
    this.tasksService.completeTask(this.task.taskId).subscribe({
      next: () => {
        this.task.userStatus = Status.Completed;
        alert('Task Completed! ✅');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  updateFeedback() {
    if (!this.task) return;
    this.tasksService.updateFeedback(this.task.taskId, this.feedbackInput).subscribe({
      next: () => {
        this.task.feedback = this.feedbackInput;
        alert('Feedback Updated! ✅');
        this.router.navigate(['/dashboard']);
      }
    });
  }
}