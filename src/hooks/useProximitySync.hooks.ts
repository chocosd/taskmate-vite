import { ChannelMessageType } from '@enums/channel-message-type.enum';
import { ChannelMessage, PositionUpdateChannelMessage } from '@models/channel-message.model';
import { distinctUntilObjectChanged } from '@utils/distinct-until-object-changed';
import { calculateProximity, getMyWindowPosition, WindowPosition } from '@utils/position';
import { useEffect, useRef } from 'react';
import { useSharedWindow } from '../context/shared-window/useSharedWindow';

const THRESHOLD = 0.92;

function isValidMessage(data: ChannelMessage, currentId: string): boolean {
    return !!data.payload && data.payload?.id !== currentId;
}

export function isChannelMessageOfType<
    T extends ChannelMessageType,
    M extends ChannelMessage = Extract<ChannelMessage, { type: T }>,
>(data: ChannelMessage, type: T): data is M {
    return data.type === type;
}

export function useProximitySync() {
    const {
        registerMessageHandler,
        updateProximity,
        triggerSharePrompt,
        sendChannelMessage,
        myId,
    } = useSharedWindow();

    const lastSentPosition = useRef<WindowPosition>(getMyWindowPosition());
    const recentlyPromptedPeers = useRef<Set<string>>(new Set());

    const shouldSendUpdate = (current: WindowPosition): boolean => {
        if (!distinctUntilObjectChanged(current, lastSentPosition.current)) {
            return false;
        }

        lastSentPosition.current = current;
        return true;
    };

    useEffect(() => {
        const handleMessage = (data: ChannelMessage) => {
            const { type, payload } = data;
            if (!isValidMessage(data, myId)) {
                return;
            }

            switch (type) {
                case ChannelMessageType.PositionUpdate: {
                    const otherPos = payload.position as WindowPosition;
                    const myPos = getMyWindowPosition();

                    const proximity = calculateProximity(myPos, otherPos);

                    updateProximity((prev) => {
                        if (
                            !prev ||
                            prev.edge !== proximity.edge ||
                            Math.abs(prev.intensity - proximity.intensity) > 0.01
                        ) {
                            return proximity;
                        }
                        return prev;
                    });

                    if (shouldSendUpdate(myPos)) {
                        sendChannelMessage({
                            type: ChannelMessageType.PositionUpdate,
                            payload: { id: myId, position: myPos },
                        } as unknown as PositionUpdateChannelMessage);
                    }

                    if (
                        proximity.intensity >= THRESHOLD &&
                        !recentlyPromptedPeers.current.has(payload.id)
                    ) {
                        recentlyPromptedPeers.current.add(payload.id);

                        sendChannelMessage({
                            type: ChannelMessageType.TaskShareOffer,
                            payload: { id: myId },
                        });

                        triggerSharePrompt(payload.id);
                    }
                    break;
                }

                case ChannelMessageType.TaskShareOffer:
                    triggerSharePrompt(payload.id);
                    break;

                case ChannelMessageType.TaskShareAccept:
                    // TODO: Handle confirm
                    break;

                case ChannelMessageType.TaskShareData:
                    // TODO: Handle task injection
                    break;

                default:
                    break;
            }
        };

        const interval = setInterval(() => {
            const current = getMyWindowPosition();
            if (shouldSendUpdate(current)) {
                sendChannelMessage({
                    type: ChannelMessageType.PositionUpdate,
                    payload: { id: myId, position: current },
                } as unknown as PositionUpdateChannelMessage);
            }
        }, 600);

        registerMessageHandler(handleMessage);

        return () => clearInterval(interval);
    }, [myId, registerMessageHandler, sendChannelMessage, triggerSharePrompt, updateProximity]);
}
