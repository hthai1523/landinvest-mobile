export const getBoundingBoxCenterFromString = (boundingbox: string) => {
    let coordinates

    if (typeof boundingbox === 'string') {
        try {
            if (boundingbox.startsWith('[') && boundingbox.endsWith(']')) {
                boundingbox = boundingbox.replace(/^\[|\]$/g, '');
                coordinates = boundingbox.split(',').map(Number);
            } else {
                coordinates = boundingbox.split(',').map(Number);
            }
        } catch (e) {
            console.error('Error parsing boundingbox string:', e);
            throw new Error('Invalid boundingbox format');
        }
    } else {
        coordinates = boundingbox;
    }

    if (coordinates.length !== 4) {
        throw new Error('Bounding box must have exactly 4 coordinates.');
    }

    const [lonMin, latMin, lonMax, latMax] = coordinates;

    const centerLatitude = (latMin + latMax) / 2;
    const centerLongitude = (lonMin + lonMax) / 2;

    return { centerLatitude, centerLongitude };
};