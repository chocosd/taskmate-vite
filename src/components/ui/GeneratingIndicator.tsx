type GeneratingIndicatorProps = {
    message?: string;
    className?: string;
};

export default function GeneratingIndicator({
    message = 'Generating tasks from AI...',
    className = '',
}: GeneratingIndicatorProps) {
    return (
        <div
            className={`flex items-center w-full p-8 justify-center gap-2 text-lg text-blue-500 animate-pulse ${className}`}
        >
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z"
                />
            </svg>
            {message}
        </div>
    );
}
