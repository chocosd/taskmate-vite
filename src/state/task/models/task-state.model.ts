import { type Task } from '@models/task';
import { TaskActionTypes } from '../enums/task-state.enum';

export type TaskState = {
    tasks: Task[];
};

export interface BaseTaskAction {
    payload: object;
}

export interface AddTaskAction extends BaseTaskAction {
    type: TaskActionTypes.AddTask;
    payload: { title: string; generated?: boolean };
}

export interface ToggleTaskAction extends BaseTaskAction {
    type: TaskActionTypes.ToggleTask;
    payload: { id: string };
}

export interface DeleteTaskAction extends BaseTaskAction {
    type: TaskActionTypes.DeleteTask;
    payload: { id: string };
}

export type TaskAction = AddTaskAction | ToggleTaskAction | DeleteTaskAction;
