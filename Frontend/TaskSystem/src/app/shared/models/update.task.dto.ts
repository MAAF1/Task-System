import { Status } from "./status.enum";
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    DueDate?: Date | null;
    taskItemStatus?: number;
}
