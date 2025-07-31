import { useCalendarOptions } from '@context/calendar-options/useCalendarOptions';
import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { CalendarDateUtils } from '@utils/helpers/date.helper';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import CalendarDayDrawer from './CalendarDayDrawer';
import CalendarItem from './CalendarItem';

interface WeekViewProps {
    selectedDate: Date;
    events: CalendarEvent[];
    scheduledTasks: ScheduledTask[];
    onDayClick: (date: Date) => void;
    onUpdateEvent?: (updatedEvent: CalendarEvent) => void;
    onUpdateTask?: (updatedTask: ScheduledTask) => void;
    onDeleteEvent?: (eventId: string) => void;
    onDeleteTask?: (taskId: string) => void;
}

export default function WeekView({
    selectedDate,
    events,
    scheduledTasks,
    onDayClick,
    onUpdateEvent,
    onUpdateTask,
    onDeleteEvent,
    onDeleteTask,
}: WeekViewProps) {
    const { options } = useCalendarOptions();
    const [drawerItem, setDrawerItem] = useState<
        CalendarEvent | ScheduledTask | null
    >(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Reset visibility when date changes
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [selectedDate]);

    const weekDates = CalendarDateUtils.getWeekDates(selectedDate);
    const hours = CalendarDateUtils.getWorkHours(
        options.workStartHour,
        options.workEndHour
    );

    // Get all items for the week and organize them by day
    const getItemsForWeek = () => {
        const weekItems: Record<
            string,
            (CalendarEvent | ScheduledTask)[]
        > = {};

        weekDates.forEach((date) => {
            const dateStr =
                DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
            const dateStart =
                DateTime.fromJSDate(date).startOf('day');

            // Find events that start on this date OR span across this date
            const dayEvents = events.filter((event) => {
                const eventStart = DateTime.fromJSDate(event.start);
                const eventEnd = DateTime.fromJSDate(event.end);
                const eventStartDate = eventStart.startOf('day');
                const eventEndDate = eventEnd.startOf('day');
                const dateStartOfDay = dateStart.startOf('day');

                // Event starts on this date OR spans across this date
                return (
                    eventStartDate.equals(dateStartOfDay) ||
                    (eventStartDate < dateStartOfDay &&
                        eventEndDate >= dateStartOfDay)
                );
            });

            // Find tasks that start on this date OR span across this date
            const dayTasks = scheduledTasks.filter((task) => {
                const taskStart = DateTime.fromJSDate(task.start);
                const taskEnd = DateTime.fromJSDate(task.end);
                const taskStartDate = taskStart.startOf('day');
                const taskEndDate = taskEnd.startOf('day');
                const dateStartOfDay = dateStart.startOf('day');

                // Task starts on this date OR spans across this date
                return (
                    taskStartDate.equals(dateStartOfDay) ||
                    (taskStartDate < dateStartOfDay &&
                        taskEndDate >= dateStartOfDay)
                );
            });

            weekItems[dateStr] = [...dayEvents, ...dayTasks];
        });

        return weekItems;
    };

    const weekItems = getItemsForWeek();

    const handleItemClick = (item: CalendarEvent | ScheduledTask) => {
        setDrawerItem(item);
        setIsDrawerOpen(true);
    };

    const handleUpdateItem = (
        updatedItem: CalendarEvent | ScheduledTask
    ) => {
        if ('location' in updatedItem) {
            onUpdateEvent?.(updatedItem as CalendarEvent);
        } else {
            onUpdateTask?.(updatedItem as ScheduledTask);
        }
        setIsDrawerOpen(false);
    };

    const handleDeleteItem = (itemId: string) => {
        const item =
            events.find((e) => e.id === itemId) ||
            scheduledTasks.find((t) => t.taskId === itemId);

        if (item && 'location' in item) {
            onDeleteEvent?.(itemId);
        } else {
            onDeleteTask?.(itemId);
        }
        setIsDrawerOpen(false);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setDrawerItem(null);
    };

    const renderTimeSlot = (date: Date, hour: number) => {
        const dateStr =
            DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
        const dayItems = weekItems[dateStr] || [];

        // Find items that start in this specific hour OR span across this hour (for multi-day events)
        const itemsForThisHour = dayItems.filter((item) => {
            const itemStart = DateTime.fromJSDate(item.start);
            const itemEnd = DateTime.fromJSDate(item.end);
            const itemStartDate = itemStart.startOf('day');
            const itemEndDate = itemEnd.startOf('day');
            const currentDate =
                DateTime.fromJSDate(date).startOf('day');
            const itemStartHour = itemStart.hour;

            // If this is a multi-day event that spans across this date
            if (
                itemStartDate < currentDate &&
                itemEndDate >= currentDate
            ) {
                // Show it from the beginning of the day (hour 0)
                return hour === 0;
            }

            // For single-day events, show them in their actual start hour
            return itemStartHour === hour;
        });

        if (!itemsForThisHour.length) {
            return (
                <div
                    key={`${date.toISOString()}-${hour}`}
                    className="relative bg-zinc-900 border-r border-zinc-700 border-t border-zinc-700 last:border-r-0"
                    style={{ minHeight: '50px' }}
                />
            );
        }

        // Group overlapping items for this hour
        const overlappingGroups =
            CalendarDateUtils.groupOverlappingItems(itemsForThisHour);

        return (
            <div
                key={`${date.toISOString()}-${hour}`}
                className="relative bg-zinc-900 border-r border-zinc-700 border-t border-zinc-700 last:border-r-0"
                style={{ minHeight: '50px' }}
            >
                {overlappingGroups.map((group, groupIndex) => {
                    const groupWidth = 100 / group.length; // Equal width for each item in group

                    return group.map((item, itemIndex) => {
                        const itemStart = DateTime.fromJSDate(
                            item.start
                        );
                        const itemEnd = DateTime.fromJSDate(item.end);
                        const itemStartDate =
                            itemStart.startOf('day');
                        const itemEndDate = itemEnd.startOf('day');
                        const currentDate =
                            DateTime.fromJSDate(date).startOf('day');

                        let displayStart = itemStart;
                        const displayEnd = itemEnd;

                        // For multi-day events that span across this date, show them from the start of the day
                        if (
                            itemStartDate < currentDate &&
                            itemEndDate >= currentDate
                        ) {
                            displayStart = currentDate;
                        }

                        const height =
                            CalendarDateUtils.calculateItemHeight(
                                displayStart.toJSDate(),
                                displayEnd.toJSDate()
                            );
                        const topPosition =
                            CalendarDateUtils.calculateItemPosition(
                                displayStart.toJSDate(),
                                hour
                            );
                        const leftPosition = itemIndex * groupWidth;

                        return (
                            <CalendarItem
                                key={
                                    (item as CalendarEvent).id ||
                                    (item as ScheduledTask).taskId
                                }
                                item={item}
                                height={height}
                                topPosition={topPosition}
                                zIndex={10 + groupIndex}
                                width={groupWidth}
                                leftPosition={leftPosition}
                                onItemClick={handleItemClick}
                                animationDelay={
                                    groupIndex * 50 + itemIndex * 25
                                }
                            />
                        );
                    });
                })}
            </div>
        );
    };

    return (
        <>
            <div
                className={`grid grid-cols-8 gap-0 text-sm border border-zinc-700 rounded-lg overflow-hidden transition-all duration-500 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                }`}
            >
                {/* Time column header */}
                <div className="text-zinc-400 font-medium p-2 bg-zinc-800 border-r border-zinc-700">
                    Time
                </div>

                {/* Day headers */}
                {weekDates.map((date) => (
                    <div
                        key={date.toISOString()}
                        className="text-zinc-300 font-medium p-2 text-center cursor-pointer hover:bg-zinc-700 bg-zinc-800 border-r border-zinc-700 last:border-r-0"
                        onClick={() => onDayClick(date)}
                    >
                        <div className="text-xs">
                            {DateTime.fromJSDate(date).toFormat(
                                'EEE'
                            )}
                        </div>
                        <div className="text-sm font-semibold">
                            {DateTime.fromJSDate(date).toFormat('d')}
                        </div>
                    </div>
                ))}

                {/* Time slots with flexible content */}
                {hours.map((hour) => (
                    <div key={hour} className="contents">
                        {/* Time label */}
                        <div className="text-zinc-400 text-xs p-2 bg-zinc-900 border-r border-zinc-700 border-t border-zinc-700">
                            {DateTime.fromObject({ hour }).toFormat(
                                'h a'
                            )}
                        </div>

                        {/* Day columns */}
                        {weekDates.map((date) =>
                            renderTimeSlot(date, hour)
                        )}
                    </div>
                ))}
            </div>

            {/* Side Drawer */}
            <CalendarDayDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                item={drawerItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
            />
        </>
    );
}
