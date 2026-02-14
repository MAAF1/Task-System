import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthRequest } from '../../models/task.models';

@Component({
  selector: 'app-auth-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-panel.component.html'
})
export class AuthPanelComponent {
  @Input() authMode: 'login' | 'register' = 'login';
  @Input() form: AuthRequest = { email: '', password: '', userName: '' };
  @Input() message = '';

  @Output() modeChange = new EventEmitter<'login' | 'register'>();
  @Output() submitForm = new EventEmitter<void>();
}
