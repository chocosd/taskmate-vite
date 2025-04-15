import { nanoid } from 'nanoid';
import { TaskActionTypes } from './enums/task-state.enum';
import { type TaskAction, type TaskState } from './models/task-state.model';

export const initialTaskState: TaskState = {
    tasks: [],
};

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case TaskActionTypes.AddTask:
            return {
                tasks: [
                    {
                        id: nanoid(),
                        title: action.payload.title,
                        completed: false,
                        createdAt: Date.now(),
                        generated: action.payload.generated ?? false,
                    },
                    ...state.tasks,
                ],
            };

        case TaskActionTypes.ToggleTask:
            return {
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? { ...task, completed: !task.completed } : task
                ),
            };

        case TaskActionTypes.DeleteTask:
            return {
                tasks: state.tasks.filter((task) => task.id !== action.payload.id),
            };

        default:
            return state;
    }
}
