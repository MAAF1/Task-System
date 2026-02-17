import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskItemService } from '../../../core/services/task.item.service';
import { TaskResponseDto } from '../../../shared/models/task.response.dto';
import { UpdateTaskDto } from '../../../shared/models/update.task.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin.task.details.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.task.details.component.html',
  styleUrl: './admin.task.details.component.css',
})
export class AdminTaskDetailsComponent implements OnInit {
  taskId!: number;
  taskDetails!: TaskResponseDto;
  loading = true;
  error ?: string;
  userIdToAssign ?: number;
  userIdToRemove?: number;
  constructor(private route: ActivatedRoute, private taskItemService: TaskItemService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('taskId'));
    this.fetchTask();
  }
  fetchTask() {
  this.loading = true;
  this.taskItemService.getTaskById(this.taskId).subscribe({
    next: (response: any) => {
      
      const task = Array.isArray(response) ? response[0] : response;

      if (task) {
       
        if (task.dueDate) {
          task.dueDate = new Date(task.dueDate).toISOString().split('T')[0];
        }
        this.taskDetails = task;
      }
      
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      this.error = error.message;
      this.loading = false;
    },
  });
}
  updateTask() {
  if (!this.taskDetails) return;

  const updatedTask: UpdateTaskDto = {
    title: this.taskDetails.title,
    description: this.taskDetails.description,
    DueDate: this.taskDetails.dueDate,   
    taskItemStatus: this.taskDetails.taskItemStatus
  };

  this.taskItemService.updateTask(this.taskId, updatedTask).subscribe({
    next: (res) => {
      console.log('Task updated successfully:', res);
      this.fetchTask(); // إعادة تحميل الداتا بعد التحديث
    },
    error: (error) => {
      console.error('Error updating task:', error);
      this.error = 'Failed to update task. Please try again.';
    },
  });
}


  deleteTask() {
    
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskItemService.deleteTask(this.taskId).subscribe({
      next: () => {
        alert('Task deleted');
        this.router.navigate(['/admindashboard']);
      },
      error: err => console.error(err)
    });
  }

  assignUser() {
    if(!this.taskDetails || !this.userIdToAssign) return;
    if (!this.userIdToAssign) return alert('Please enter a user ID to assign');
    this.taskItemService.assignTask(this.taskId, this.userIdToAssign).subscribe({
      next: () => {
        alert('User assigned successfully');
        this.fetchTask();
      },
      error: err => console.error(err)
    });
  }

  removeUser() {
    if(!this.taskDetails || !this.userIdToRemove) return;
    this.taskItemService.removeAssignment(this.taskId, this.userIdToRemove).subscribe({
      next: () => {
        alert('User removed successfully');
        this.fetchTask();
      },
      error: err => console.error(err)
    });
  }
}
