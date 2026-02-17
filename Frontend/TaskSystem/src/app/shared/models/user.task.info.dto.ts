import { Status } from "./status.enum";
export interface UserTaskInfoDto {
  userId: number;
  userName: string;
  userStatus: number;  
  feedback?: string;
  assignedDate?: string;  
  userDueDate?: string;
  userClosedDate?: string;
}