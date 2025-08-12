import { Task } from '@models/task.model';
import { FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface ProofSubmissionData {
    proofFile: File | null;
}

interface ProofSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (file: File) => void;
    task: Task;
}

export default function ProofSubmissionModal({
    isOpen,
    onClose,
    onSubmit,
    task,
}: ProofSubmissionModalProps) {
    const [proofData, setProofData] = useState<ProofSubmissionData>({
        proofFile: null,
    });
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (file: File) => {
        // Validate file type (allow common document formats)
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(
                'Please select a valid document file (PDF, Word, text, or image)'
            );
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setProofData({ proofFile: file });
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setProofData({ proofFile: null });
    };

    const handleSubmit = (data: ProofSubmissionData) => {
        if (data.proofFile) {
            onSubmit(data.proofFile);
            setProofData({ proofFile: null }); // Reset form
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 ${!isOpen ? 'hidden' : ''}`}
        >
            <div className="bg-zinc-900 text-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                    Submit Proof for: {task.title}
                </h2>

                <div className="mb-6">
                    <p className="text-sm text-zinc-400 mb-4">
                        Upload a document that proves you completed
                        this task. The document will be verified
                        against the task description.
                    </p>

                    {!proofData.proofFile ? (
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                dragActive
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-zinc-600 hover:border-zinc-500'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                            <p className="text-sm text-zinc-300 mb-2">
                                Drag and drop a file here, or click to
                                select
                            </p>
                            <p className="text-xs text-zinc-500 mb-4">
                                Supported: PDF, Word, text, images
                                (max 10MB)
                            </p>
                            <input
                                type="file"
                                onChange={handleFileInput}
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                                className="hidden"
                                id="proof-file-input"
                            />
                            <label
                                htmlFor="proof-file-input"
                                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer text-sm transition-colors"
                            >
                                Choose File
                            </label>
                        </div>
                    ) : (
                        <div className="border border-zinc-600 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {proofData.proofFile.name}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        {(
                                            proofData.proofFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{' '}
                                        MB
                                    </p>
                                </div>
                                <button
                                    onClick={removeFile}
                                    className="text-zinc-400 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSubmit(proofData)}
                        disabled={!proofData.proofFile}
                        className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-sm"
                    >
                        Submit Proof & Complete Task
                    </button>
                </div>
            </div>
        </div>
    );
}
