export type TaskStatus = 'Pending' | 'InProgress' | 'Completed';

export interface UserTaskInfo {
  userId: number;
  userName: string;
  status: TaskStatus;
  feedback?: string | null;
}

export interface TaskItem {
  taskId: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdDate: string;
  dueDate?: string | null;
  closedDate?: string | null;
  assignedUsers: UserTaskInfo[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
  assignedUserIds: number[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  status?: TaskStatus;
}

export interface AuthRequest {
  email: string;
  password: string;
  userName?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  username: string;
  email: string;
  roles: string[];
}

export interface RegisterResponse {
  message: string;
  userId: number;
  username: string;
  email: string;
}

export interface MyTaskItem {
  taskId: number;
  title: string;
  description?: string | null;
  taskDueDate?: string | null;
  taskClosedDate?: string | null;
  taskItemStatus: TaskStatus;
  userStatus: TaskStatus;
  userAssignedDate: string;
  userClosedDate?: string | null;
  userDueDate?: string | null;
  feedback?: string | null;
}
