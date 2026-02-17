import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTasks } from '../../tasks/my-tasks/my-tasks';

@Component({
  selector: 'app-dashboard.component',
  imports: [MyTasks, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

}
