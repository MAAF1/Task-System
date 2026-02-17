import { Status } from './status.enum';
export interface MyTaskDto {
    taskId: number;
    title: string;
    description?: string;
    taskDueDate?: Date | null;
    taskClosedDate?: Date | null;
    taskItemStatus: Status;

    userStatus: Status;
    userAssignedDate: Date;
    userClosedDate?: Date | null;
    userDueDate?: Date | null;
    feedback?: string;
}
