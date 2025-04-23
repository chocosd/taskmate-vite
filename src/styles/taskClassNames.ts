export const baseTaskStyles =
    'flex items-center justify-between p-3 rounded-md transition-all';

export const taskStyles = {
    default: `${baseTaskStyles} border-l-8 border-blue-500 bg-white dark:bg-zinc-900 hover:border-blue-400`,
    completed: `${baseTaskStyles} border-l-8 border-teal-700 bg-white dark:bg-zinc-800`,
    ai: `${baseTaskStyles} border-l-8 border-purple-500 bg-white dark:bg-zinc-900`,
};

export const aiBadge =
    'text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse ml-2';

export const disabledGenerateButton =
    'opacity-50 bg-zinc-600 cursor-not-allowed text-gray-400 transition-all';

export const activeGenerateButton =
    'text-white px-4 py-2 rounded-md swipe-gradient shadow-md hover:brightness-110';
