import { type Task } from '@models/task.model';
import { TaskActionTypes } from '../enums/task-state.enum';

export type TaskState = {
    tasks: Task[];
};

export interface BaseTaskAction {
    payload: object;
}

export interface AddTaskAction extends BaseTaskAction {
    type: TaskActionTypes.AddTask;
    payload: { title: string; generated?: boolean; order: number; parent_id?: string };
}

export interface AssignTaskAction extends BaseTaskAction {
    type: TaskActionTypes.AssignTask;
    payload: { id: string; email: string };
}

export interface ToggleTaskAction extends BaseTaskAction {
    type: TaskActionTypes.ToggleTask;
    payload: { id: string };
}

export interface DeleteTaskAction extends BaseTaskAction {
    type: TaskActionTypes.DeleteTask;
    payload: { id: string };
}

export interface ReorderTaskAction extends BaseTaskAction {
    type: TaskActionTypes.ReorderTasks;
    payload: Task[];
}

export type TaskAction =
    | AddTaskAction
    | AssignTaskAction
    | ToggleTaskAction
    | DeleteTaskAction
    | ReorderTaskAction;
