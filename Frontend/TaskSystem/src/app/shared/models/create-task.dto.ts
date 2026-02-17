import { Status } from './status.enum';
export interface CreateTaskDto {
  Title: string;             
  Description?: string;      
  DueDate?: Date | null;     
  Status?: number;           
  AssignedUserIds: number[]; 
}
