import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import { CalendarDateUtils } from '@utils/helpers/date.helper';
import { DateTime } from 'luxon';
import CalendarItem from './CalendarItem';

interface WeekViewProps {
    selectedDate: Date;
    events: CalendarEvent[];
    scheduledTasks: ScheduledTask[];
    onDayClick: (date: Date) => void;
}

export default function WeekView({
    selectedDate,
    events,
    scheduledTasks,
    onDayClick,
}: WeekViewProps) {
    const weekDates = CalendarDateUtils.getWeekDates(selectedDate);
    const hours = CalendarDateUtils.getWorkHours();

    const renderTimeSlot = (date: Date, hour: number) => {
        const { events: hourEvents, tasks: hourTasks } =
            CalendarDateUtils.getItemsForDateAndTime(
                date,
                hour,
                events,
                scheduledTasks
            );
        const allItems = [...hourEvents, ...hourTasks];

        if (allItems.length === 0) {
            return (
                <div
                    key={`${date.toISOString()}-${hour}`}
                    className="relative bg-zinc-900 border-r border-zinc-700 border-t border-zinc-700 last:border-r-0"
                    style={{ minHeight: '50px' }}
                />
            );
        }

        // Group overlapping items
        const overlappingGroups =
            CalendarDateUtils.groupOverlappingItems(allItems);

        return (
            <div
                key={`${date.toISOString()}-${hour}`}
                className="relative bg-zinc-900 border-r border-zinc-700 border-t border-zinc-700 last:border-r-0"
                style={{ minHeight: '50px' }}
            >
                {overlappingGroups.map((group, groupIndex) => {
                    const groupWidth = 100 / group.length; // Equal width for each item in group

                    return group.map((item, itemIndex) => {
                        const height =
                            CalendarDateUtils.calculateItemHeight(
                                item.start,
                                item.end
                            );
                        const topPosition =
                            CalendarDateUtils.calculateItemPosition(
                                item.start,
                                hour
                            );
                        const leftPosition = itemIndex * groupWidth;

                        return (
                            <CalendarItem
                                key={item.id || item.taskId}
                                item={item}
                                height={height}
                                topPosition={topPosition}
                                zIndex={10 + groupIndex}
                                width={groupWidth}
                                leftPosition={leftPosition}
                            />
                        );
                    });
                })}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-8 gap-0 text-sm border border-zinc-700 rounded-lg overflow-hidden">
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
                        {DateTime.fromJSDate(date).toFormat('EEE')}
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
    );
}
