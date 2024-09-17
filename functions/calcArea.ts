interface Coordinates {
    latitude: number;
    longitude: number;
}

export const calcArea = (locations: Coordinates[]): number => {
    if (!locations.length || locations.length < 3) {
        return 0;
    }

    const radius = 6371000; // Earth's radius in meters
    const diameter = radius * 2;
    const circumference = diameter * Math.PI;
    const listY: number[] = [];
    const listX: number[] = [];
    const listArea: number[] = [];

    const latitudeRef = locations[0].latitude;
    const longitudeRef = locations[0].longitude;

    // Calculate segment x and y in degrees for each point
    for (let i = 1; i < locations.length; i++) {
        const latitude = locations[i].latitude;
        const longitude = locations[i].longitude;

        listY.push(calculateYSegment(latitudeRef, latitude, circumference));
        listX.push(calculateXSegment(longitudeRef, longitude, latitude, circumference));
    }

    // Calculate areas for each triangle segment
    for (let i = 1; i < listX.length; i++) {
        const x1 = listX[i - 1];
        const y1 = listY[i - 1];
        const x2 = listX[i];
        const y2 = listY[i];
        listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));
    }

    // Sum areas of all triangle segments
    const areasSum = listArea.reduce((sum, area) => sum + area, 0);

    // Get absolute value of area, it can't be negative
    return Math.abs(areasSum);
};

const calculateAreaInSquareMeters = (x1: number, x2: number, y1: number, y2: number): number => {
    return (y1 * x2 - x1 * y2) / 2;
};

const calculateYSegment = (latitudeRef: number, latitude: number, circumference: number): number => {
    return ((latitude - latitudeRef) * circumference) / 360.0;
};

const calculateXSegment = (longitudeRef: number, longitude: number, latitude: number, circumference: number): number => {
    return ((longitude - longitudeRef) * circumference * Math.cos((latitude * Math.PI) / 180)) / 360.0;
};