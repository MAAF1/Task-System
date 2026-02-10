export type TaskStatus = 'Pending' | 'InProgress' | 'Completed';

export interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdDate: string;
  dueDate?: string | null;
  assignedToUserId?: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  assignedToUserId?: string | null;
}

export type UpdateTaskRequest = CreateTaskRequest;