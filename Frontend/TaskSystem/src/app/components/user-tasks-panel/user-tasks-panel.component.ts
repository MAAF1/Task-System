import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyTaskItem } from '../../models/task.models';

@Component({
  selector: 'app-user-tasks-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-tasks-panel.component.html'
})
export class UserTasksPanelComponent {
  @Input() tasks: MyTaskItem[] = [];
  @Input() feedbackDrafts: Record<number, string> = {};

  @Output() complete = new EventEmitter<number>();
  @Output() feedbackChange = new EventEmitter<{ taskId: number; value: string }>();
  @Output() saveFeedback = new EventEmitter<number>();

  getFeedbackValue(task: MyTaskItem): string {
    const draft = this.feedbackDrafts[task.taskId];
    return draft !== undefined ? draft : (task.feedback ?? '');
  }
}
