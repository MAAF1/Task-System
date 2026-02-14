import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateTaskRequest, TaskItem } from '../../models/task.models';

@Component({
  selector: 'app-admin-tasks-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tasks-panel.component.html'
})
export class AdminTasksPanelComponent {
  @Input() canDeleteTask = false;
  @Input() form: CreateTaskRequest = { title: '', status: 'Pending', assignedUserIds: [] };
  @Input() assignedUsersInput = '';
  @Input() searchTitle = '';
  @Input() tasks: TaskItem[] = [];
  @Input() message = '';

  @Output() assignedUsersInputChange = new EventEmitter<string>();
  @Output() searchTitleChange = new EventEmitter<string>();

  @Output() create = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() search = new EventEmitter<void>();
  @Output() complete = new EventEmitter<TaskItem>();
  @Output() delete = new EventEmitter<number>();

  trackByTaskId(_: number, task: TaskItem): number {
    return task.taskId;
  }
}
