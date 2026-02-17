import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskItemService } from '../../../core/services/task.item.service';
import { CreateTaskDto } from '../../../shared/models/create-task.dto';
import { Status } from '../../../shared/models/status.enum';

@Component({
  selector: 'app-create.task.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './create.task.component.html',
  styleUrl: './create.task.component.css',
})
export class CreateTaskComponent {
  Status = Status;

  // Map لتحويل الـ Status لرقم قبل الإرسال
  statusMap = {
    [Status.Pending]: 0,
    [Status.InProgress]: 1,
    [Status.Completed]: 2
  };

  assignedUsersInput = '';
  task: CreateTaskDto = {
    Title: '',
    Description: '',
    DueDate: null,
    Status: this.statusMap[Status.Pending],
    AssignedUserIds: []
  };

  loading = false;
  error?: string;

  constructor(private taskItemService: TaskItemService, private router: Router) {}

  createTask() {
    if (!this.task.Title) {
      this.error = 'Title is required';
      return;
    }

    this.loading = true;

    // نبعت نسخة من الـ task بحيث الـ Status يبقى رقم
    const taskToSend = {
      ...this.task,
      Status: this.task.Status
    };

    this.taskItemService.addTask(taskToSend).subscribe({
      next: (res) => {
        alert(res); // هيتعرضلك "Task Created Successfully" أو رسالة الـ backend
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creating task:', err);
        this.error = 'Failed to create task. Please try again.';
        this.loading = false;
      },
    });
  }

  updateAssignedUsers(value: string) {
    this.task.AssignedUserIds = value
      .split(',')
      .map(id => Number(id.trim()))
      .filter(id => !isNaN(id));
  }
}
