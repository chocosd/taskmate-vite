import { useTaskDragAndReorder } from '@hooks/useTaskDragAndReorder.hooks';
import { Task } from '@models/task.model';
import EmptyData from '@ui/EmptyData';
import { getSubtaskStatuses } from '@utils/get-subtask-statuses';
import { useEffect, useState } from 'react';
import TaskItem from './task-item/TaskItem';

type TaskListProps = {
    tasks: Task[];
    allTasks: Task[];
    loading?: boolean;
    selectedTasks?: Set<string>;
    onTaskSelection?: (taskId: string, isSelected: boolean) => void;
    onSelectAll?: () => void;
    isSelectionMode?: boolean;
    allSelected?: boolean;
};

export default function TaskList({
    tasks,
    allTasks,
    loading = false,
    selectedTasks = new Set(),
    onTaskSelection,
    onSelectAll,
    isSelectionMode = false,
    allSelected = false,
}: TaskListProps) {
    const { draggingId, onDragStart, onDragOver, onDrop } =
        useTaskDragAndReorder(tasks);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [tasks]);

    const availableTasks = tasks.length;

    const enhancedTasks = tasks.map((task) => ({
        ...task,
        subtasks: getSubtaskStatuses(task.id, allTasks),
    }));

    // Show loading skeleton while loading
    if (loading) {
        return (
            <ul className="space-y-2">
                {[1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className="animate-pulse"
                        style={{
                            animationDelay: `${index * 100}ms`,
                        }}
                    >
                        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 bg-zinc-700 rounded mt-1"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        );
    }

    return (
        <div
            className={`transition-all duration-500 ease-out ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
            }`}
        >
            {/* Select All Checkbox */}
            {isSelectionMode && availableTasks > 0 && (
                <div className="mb-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={onSelectAll}
                            className="w-4 h-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-zinc-300">
                            Select all ({availableTasks} tasks)
                        </span>
                    </label>
                </div>
            )}

            <ul className="space-y-2">
                {availableTasks ? (
                    enhancedTasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="transition-all duration-300 ease-out animate-in slide-in-from-bottom-2"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'both',
                            }}
                        >
                            <TaskItem
                                task={task}
                                onDragStart={() => onDragStart(task)}
                                onDragOver={(e) =>
                                    onDragOver(e, task)
                                }
                                onDrop={onDrop}
                                isDragging={draggingId === task.id}
                                isSelected={selectedTasks.has(
                                    task.id
                                )}
                                onSelectionChange={(isSelected) =>
                                    onTaskSelection?.(
                                        task.id,
                                        isSelected
                                    )
                                }
                                showSelection={isSelectionMode}
                            />
                        </div>
                    ))
                ) : (
                    <div className="animate-in fade-in duration-500 delay-300">
                        <EmptyData />
                    </div>
                )}
            </ul>
        </div>
    );
}
