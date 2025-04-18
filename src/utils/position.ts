export type WindowPosition = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type ProximityData = {
    edge: 'left' | 'right' | 'top' | 'bottom';
    intensity: number; // 0–1
};

export function getMyWindowPosition(): WindowPosition {
    return {
        x: window.screenX,
        y: window.screenY,
        width: window.outerWidth,
        height: window.outerHeight,
    };
}

export function calculateProximity(myPos: WindowPosition, otherPos: WindowPosition): ProximityData {
    const threshold = 600;

    const distances = {
        left: Math.max(0, threshold - Math.abs(myPos.x - (otherPos.x + otherPos.width))),
        right: Math.max(0, threshold - Math.abs(myPos.x + myPos.width - otherPos.x)),
        top: Math.max(0, threshold - Math.abs(myPos.y - (otherPos.y + otherPos.height))),
        bottom: Math.max(0, threshold - Math.abs(myPos.y + myPos.height - otherPos.y)),
    };

    const edge = Object.entries(distances).reduce((a, b) =>
        a[1] > b[1] ? a : b
    )[0] as ProximityData['edge'];
    const intensity = Math.min(1, distances[edge] / threshold);

    console.log('[Proximity] Distances:', distances);
    console.log('[Proximity] Closest edge:', edge, '→', distances[edge]);

    return { edge, intensity };
}
