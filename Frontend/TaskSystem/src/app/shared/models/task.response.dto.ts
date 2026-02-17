import { UserTaskInfoDto } from "./user.task.info.dto";
import { Status } from "./status.enum";
export interface TaskResponseDto {
  taskId: number;
  title: string;
  description?: string;
  taskItemStatus: number;   // match enum backend
  createdDate: Date;      // أو Date
  dueDate?: Date;
  closedDate?: Date;
  createdBy: string;
  assignedUsers: UserTaskInfoDto[];
}