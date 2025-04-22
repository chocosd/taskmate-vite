import { ChannelMessage } from '@models/channel-message.model';
import { ProximityData } from '@utils/position';
import { useEffect, useRef, useState } from 'react';
import { ProximityUpdater } from './shared-window-context.model';
import { SharedWindowContext } from './shared-window.context';

export function SharedWindowProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [proximity, setProximity] = useState<ProximityData | null>(
        null
    );
    const [sharePromptPeerId, setSharePromptPeerId] = useState<
        string | null
    >(null);
    const [myId] = useState(() => crypto.randomUUID());

    const channelRef = useRef(
        new BroadcastChannel('taskmate-proximity')
    );
    const handlersRef = useRef<((data: ChannelMessage) => void)[]>(
        []
    );

    useEffect(() => {
        const channel = channelRef.current;

        channel.onmessage = (e) => {
            const data = e.data as ChannelMessage;
            handlersRef.current.forEach((handler) => handler(data));
        };
    }, []);

    const sendChannelMessage = (message: ChannelMessage) => {
        channelRef.current.postMessage(message);
    };

    const registerMessageHandler = (
        handler: (data: ChannelMessage) => void
    ) => {
        if (!handlersRef.current.includes(handler)) {
            handlersRef.current.push(handler);
        }
    };

    const triggerSharePrompt = (peerId: string | null) =>
        setSharePromptPeerId(peerId);

    const updateProximity = (update: ProximityUpdater) => {
        setProximity((prev) =>
            typeof update === 'function' ? update(prev) : update
        );
    };

    return (
        <SharedWindowContext.Provider
            value={{
                proximity,
                updateProximity,
                sharePromptPeerId,
                triggerSharePrompt,
                sendChannelMessage,
                registerMessageHandler,
                myId,
            }}
        >
            {children}
        </SharedWindowContext.Provider>
    );
}
