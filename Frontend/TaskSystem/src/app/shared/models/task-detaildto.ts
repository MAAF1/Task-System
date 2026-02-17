import { Status } from "./status.enum";
export interface TaskDetailDto {
    userName: string;
    title: string;
    description: string;
    createdDate?: Date;
    dueDate?: Date;
    closedDate?: Date;
    taskStatus: Status;
    createdByName: string;
    feedBack: string;
    userTaskStatus: Status;
    assignedDate?: Date;
    userTaskDueDate?: Date;
    userTaskClosedDate?: Date;  
}
