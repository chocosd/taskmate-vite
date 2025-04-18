let channel: BroadcastChannel | null = null;

export function getProximityChannel(): BroadcastChannel {
    if (!channel) {
        channel = new BroadcastChannel('taskmate-proximity');
    }
    return channel;
}
