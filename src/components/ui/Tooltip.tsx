import { ReactNode, useState } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({
    children,
    content,
    position = 'top',
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            case 'bottom':
                return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
            default:
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
        }
    };

    const getArrowClasses = () => {
        switch (position) {
            case 'top':
                return 'top-full left-1/2 transform -translate-x-1/2 border-t-zinc-800';
            case 'bottom':
                return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-zinc-800';
            case 'left':
                return 'left-full top-1/2 transform -translate-y-1/2 border-l-zinc-800';
            case 'right':
                return 'right-full top-1/2 transform -translate-y-1/2 border-r-zinc-800';
            default:
                return 'top-full left-1/2 transform -translate-x-1/2 border-t-zinc-800';
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={`absolute z-50 ${getPositionClasses()}`}
                >
                    <div className="bg-zinc-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {content}
                        <div
                            className={`absolute w-0 h-0 border-2 border-transparent ${getArrowClasses()}`}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
