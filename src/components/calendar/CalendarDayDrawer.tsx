import Button from '@components/ui/Button';
import { CalendarEvent, ScheduledTask } from '@models/calendar.model';
import {
    Clock,
    Edit3,
    FileText,
    MapPin,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

interface CalendarDayDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    item: CalendarEvent | ScheduledTask | null;
    onUpdateItem: (
        updatedItem: CalendarEvent | ScheduledTask
    ) => void;
    onDeleteItem: (itemId: string) => void;
}

interface DrawerFormData {
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    tags: string[];
    attachments: File[];
}

export default function CalendarDayDrawer({
    isOpen,
    onClose,
    item,
    onUpdateItem,
    onDeleteItem,
}: CalendarDayDrawerProps) {
    const [formData, setFormData] = useState<DrawerFormData>({
        title: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        priority: 'medium',
        tags: [],
        attachments: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEvent = item && 'location' in item;

    // Initialize form data when item changes
    useEffect(() => {
        if (item) {
            const startTime = DateTime.fromJSDate(
                item.start
            ).toFormat('HH:mm');
            const endTime = DateTime.fromJSDate(item.end).toFormat(
                'HH:mm'
            );

            setFormData({
                title: item.title,
                startTime,
                endTime,
                location: item.location || '',
                description: item.description || '',
                priority: isEvent
                    ? undefined
                    : (item as ScheduledTask).priority,
                tags: item.tags || [],
                attachments: [],
            });
        }
    }, [item, isEvent]);

    const handleInputChange = (
        field: keyof DrawerFormData,
        value: any
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTagChange = (tags: string) => {
        const tagArray = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        setFormData((prev) => ({
            ...prev,
            tags: tagArray,
        }));
    };

    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);
        setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...files],
        }));
    };

    const removeAttachment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const handleSubmit = async () => {
        if (!item) return;

        setIsSubmitting(true);
        try {
            // Parse the time strings and update the item
            const startDateTime = DateTime.fromFormat(
                formData.startTime,
                'HH:mm'
            );
            const endDateTime = DateTime.fromFormat(
                formData.endTime,
                'HH:mm'
            );

            if (!startDateTime.isValid || !endDateTime.isValid) {
                throw new Error('Invalid time format');
            }

            // Create new start and end dates
            const originalStart = DateTime.fromJSDate(item.start);
            const newStart = originalStart.set({
                hour: startDateTime.hour,
                minute: startDateTime.minute,
            });
            const newEnd = originalStart.set({
                hour: endDateTime.hour,
                minute: endDateTime.minute,
            });

            // Ensure end time is after start time
            if (newEnd <= newStart) {
                throw new Error('End time must be after start time');
            }

            const updatedItem = {
                ...item,
                title: formData.title,
                start: newStart.toJSDate(),
                end: newEnd.toJSDate(),
                location: formData.location,
                description: formData.description,
                tags: formData.tags,
                ...(isEvent ? {} : { priority: formData.priority }),
            };

            onUpdateItem(updatedItem);
            onClose();
        } catch (error) {
            console.error('Error updating item:', error);
            // You could add toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (!item) return;

        const itemId = isEvent
            ? (item as CalendarEvent).id
            : (item as ScheduledTask).taskId;
        onDeleteItem(itemId);
        onClose();
    };

    if (!item) return null;

    return (
        <div
            className={`fixed inset-y-0 right-0 w-96 bg-zinc-900 border-l border-zinc-700 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        {isEvent ? 'Edit Event' : 'Edit Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                handleInputChange(
                                    'title',
                                    e.target.value
                                )
                            }
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter title"
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        'startTime',
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                End Time
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) =>
                                    handleInputChange(
                                        'endTime',
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) =>
                                handleInputChange(
                                    'location',
                                    e.target.value
                                )
                            }
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter location"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange(
                                    'description',
                                    e.target.value
                                )
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Enter description"
                        />
                    </div>

                    {/* Priority (for tasks only) */}
                    {!isEvent && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) =>
                                    handleInputChange(
                                        'priority',
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    )}

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Tags
                        </label>
                        <input
                            type="text"
                            value={formData.tags.join(', ')}
                            onChange={(e) =>
                                handleTagChange(e.target.value)
                            }
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter tags separated by commas"
                        />
                    </div>

                    {/* File Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Attachments
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />

                        {/* Display attached files */}
                        {formData.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {formData.attachments.map(
                                    (file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-zinc-800 rounded px-2 py-1"
                                        >
                                            <span className="text-xs text-zinc-300 truncate">
                                                {file.name}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeAttachment(
                                                        index
                                                    )
                                                }
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-700 space-y-2">
                    <div className="flex gap-2">
                        <Button
                            action={handleSubmit}
                            disabled={isSubmitting}
                            classes="flex-1"
                        >
                            <Save className="w-4 h-4 mr-1" />
                            {isSubmitting
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>
                        <Button
                            action={handleDelete}
                            variant="danger"
                            classes="px-4"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
