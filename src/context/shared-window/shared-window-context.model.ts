import { ChannelMessage } from '@models/channel-message.model';
import { ProximityData } from '@utils/position';

export type ProximityUpdater = ProximityData | ((prev: ProximityData | null) => ProximityData);

export type SharedWindowContextType<T = ChannelMessage> = {
    proximity: ProximityData | null;
    updateProximity: (update: ProximityUpdater) => void;
    sharePromptPeerId: string | null;
    triggerSharePrompt: (peerId: string | null) => void;
    sendChannelMessage: (message: T) => void;
    registerMessageHandler: (handler: (data: ChannelMessage) => void) => void;
    myId: string;
};
