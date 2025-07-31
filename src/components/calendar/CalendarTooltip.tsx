import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CalendarTooltipProps {
    title: string;
    timeRange: string;
    duration: string;
    priority?: 'low' | 'medium' | 'high';
    location?: string;
    isVisible: boolean;
    triggerElement: HTMLElement | null;
}

export default function CalendarTooltip({
    title,
    timeRange,
    duration,
    priority,
    location,
    isVisible,
    triggerElement,
}: CalendarTooltipProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [placement, setPlacement] = useState<
        'top' | 'bottom' | 'left' | 'right'
    >('top');

    useEffect(() => {
        if (!isVisible || !triggerElement || !tooltipRef.current)
            return;

        const updatePosition = () => {
            const rect = triggerElement.getBoundingClientRect();
            const tooltipRect =
                tooltipRef.current!.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Calculate available space in each direction
            const spaceAbove = rect.top;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceLeft = rect.left;
            const spaceRight = viewportWidth - rect.right;

            // Determine best placement
            let newPlacement: 'top' | 'bottom' | 'left' | 'right' =
                'top';
            let newTop = 0;
            let newLeft = 0;

            if (spaceAbove >= tooltipRect.height + 10) {
                // Prefer top placement
                newPlacement = 'top';
                newTop = rect.top - tooltipRect.height - 10;
                newLeft =
                    rect.left +
                    rect.width / 2 -
                    tooltipRect.width / 2;
            } else if (spaceBelow >= tooltipRect.height + 10) {
                // Use bottom placement
                newPlacement = 'bottom';
                newTop = rect.bottom + 10;
                newLeft =
                    rect.left +
                    rect.width / 2 -
                    tooltipRect.width / 2;
            } else if (spaceRight >= tooltipRect.width + 10) {
                // Use right placement
                newPlacement = 'right';
                newTop =
                    rect.top +
                    rect.height / 2 -
                    tooltipRect.height / 2;
                newLeft = rect.right + 10;
            } else if (spaceLeft >= tooltipRect.width + 10) {
                // Use left placement
                newPlacement = 'left';
                newTop =
                    rect.top +
                    rect.height / 2 -
                    tooltipRect.height / 2;
                newLeft = rect.left - tooltipRect.width - 10;
            } else {
                // Fallback to top with adjusted position
                newPlacement = 'top';
                newTop = Math.max(
                    10,
                    rect.top - tooltipRect.height - 10
                );
                newLeft = Math.max(
                    10,
                    Math.min(
                        viewportWidth - tooltipRect.width - 10,
                        rect.left +
                            rect.width / 2 -
                            tooltipRect.width / 2
                    )
                );
            }

            setPosition({ top: newTop, left: newLeft });
            setPlacement(newPlacement);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isVisible, triggerElement]);

    if (!isVisible) return null;

    const getArrowClass = () => {
        switch (placement) {
            case 'top':
                return 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-800';
            case 'bottom':
                return 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-zinc-800';
            case 'left':
                return 'absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-zinc-800';
            case 'right':
                return 'absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-zinc-800';
            default:
                return '';
        }
    };

    const tooltipContent = (
        <div
            ref={tooltipRef}
            className="fixed z-50 px-3 py-2 bg-zinc-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            <div className="font-semibold mb-1">{title}</div>
            <div className="text-zinc-300">{timeRange}</div>
            <div className="text-zinc-400">{duration}</div>
            {priority && (
                <div className="text-zinc-400 capitalize">
                    {priority} priority
                </div>
            )}
            {location && (
                <div className="text-zinc-400">📍 {location}</div>
            )}
            <div className={getArrowClass()}></div>
        </div>
    );

    // Render tooltip in a portal to avoid clipping
    return createPortal(tooltipContent, document.body);
}
