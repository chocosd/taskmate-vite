import { CalendarEvent } from '@models/calendar.model';
import { Upload } from 'lucide-react';

interface CalendarUploadSectionProps {
    isProcessing: boolean;
    hasUploadedCalendar: boolean;
    calendarEvents: CalendarEvent[];
    onFileUpload: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
}

export default function CalendarUploadSection({
    isProcessing,
    hasUploadedCalendar,
    calendarEvents,
    onFileUpload,
}: CalendarUploadSectionProps) {
    return (
        <div className="bg-zinc-800 rounded-lg p-4 flex-1">
            <h2 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Calendar
            </h2>

            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 text-center">
                <input
                    type="file"
                    accept=".ics"
                    onChange={onFileUpload}
                    className="hidden"
                    id="ics-upload"
                />
                <label
                    htmlFor="ics-upload"
                    className={`cursor-pointer block ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <p className="text-zinc-300 text-sm mb-1">
                        {hasUploadedCalendar
                            ? `${calendarEvents.length} events loaded`
                            : 'Upload your .ics calendar file'}
                    </p>
                    <p className="text-zinc-500 text-xs">
                        {hasUploadedCalendar
                            ? 'Upload a new file to replace current calendar'
                            : 'Click to browse or drag and drop'}
                    </p>
                </label>
            </div>
        </div>
    );
}
