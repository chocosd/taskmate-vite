import { ChannelMessageType } from '@enums/channel-message-type.enum';
import { WindowPosition } from '@utils/position';
import { Dictionary } from './dictionary';
import { Task } from './task';

type BaseChannelMessage = {
    type: ChannelMessageType;
    payload?: Dictionary;
};

export type PositionUpdateChannelMessage = BaseChannelMessage & {
    type: ChannelMessageType.PositionUpdate;
    payload: { id: string; position: WindowPosition };
};

export type TaskShareOfferChannelMessage = BaseChannelMessage & {
    type: ChannelMessageType.TaskShareOffer;
    payload: { id: string };
};

export type TaskShareAcceptChannelMessage = BaseChannelMessage & {
    type: ChannelMessageType.TaskShareAccept;
    payload: { id: string };
};

export type TaskShareDataChannelMessage = BaseChannelMessage & {
    type: ChannelMessageType.TaskShareData;
    payload: { id: string; tasks: Task[] };
};

export type ChannelMessage =
    | PositionUpdateChannelMessage
    | TaskShareOfferChannelMessage
    | TaskShareAcceptChannelMessage
    | TaskShareDataChannelMessage;
