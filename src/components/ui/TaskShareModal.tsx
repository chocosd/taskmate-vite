import Button from './Button';

type Props = {
    peerId: string;
    onAccept: () => void;
    onDecline: () => void;
};

export default function TaskShareModal({
    peerId,
    onAccept,
    onDecline,
}: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow-md max-w-sm text-center">
                <h2 className="text-xl font-semibold mb-2">
                    Incoming Task Share
                </h2>
                <p className="mb-4">
                    Another Taskmate board nearby (
                    {peerId.slice(0, 6)}) wants to share tasks with
                    you.
                </p>
                <div className="flex justify-center gap-3">
                    <Button name="Accept" action={onAccept} />
                    <Button name="Decline" action={onDecline} />
                </div>
            </div>
        </div>
    );
}
