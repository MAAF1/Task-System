import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard.component/dashboard.component';
import{ TaskDetailsComponent } from './features/tasks/task.details.component/task.details.component';
import { AdminDashboardComponent } from './features/dashboard/admin.dashboard.component/admin.dashboard.component';
import { AdminTaskDetailsComponent } from './features/tasks/admin.task.details.component/admin.task.details.component';
import { CreateTaskComponent } from './features/tasks/create.task.component/create.task.component';
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  {path: 'dashboard', component: DashboardComponent}, // all authenticated users
  {path: 'task-details/:taskId', component: TaskDetailsComponent}, // all authenticated users
  {path: 'admindashboard', component: AdminDashboardComponent}, // admin or super admin only
  {path : 'admintaskdetail/:taskId', component:AdminTaskDetailsComponent}, // super admin only
  {path: 'createtask', component:CreateTaskComponent }, // admin or super admin only
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
