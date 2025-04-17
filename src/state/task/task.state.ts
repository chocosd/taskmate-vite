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
                        order: action.payload.order,
                        ...(action.payload.parentId && { parentId: action.payload.parentId }),
                    },
                    ...state.tasks,
                ],
            };

        case TaskActionTypes.AssignTask:
            return {
                tasks: state.tasks.map((task) => ({
                    ...task,
                    ...(task.id === action.payload.id && {
                        assignedTo: action.payload.email,
                    }),
                })),
            };

        case TaskActionTypes.ToggleTask:
            return {
                tasks: state.tasks.map((task) => ({
                    ...task,
                    ...(task.id === action.payload.id && {
                        completed: !task.completed,
                    }),
                })),
            };

        case TaskActionTypes.DeleteTask:
            return {
                tasks: state.tasks.filter((task) => task.id !== action.payload.id),
            };

        case TaskActionTypes.ReorderTasks:
            return {
                tasks: action.payload,
            };

        default:
            return state;
    }
}
