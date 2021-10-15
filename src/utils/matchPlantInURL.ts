import { Plant } from '../typings/apiTypes';

export class URLError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Could not read the URL';
    }
}

const matchPlantInURL = (
    availablePlants: Plant[],
    plantFromURL: string
): Plant | undefined => {
    if (availablePlants.length < 1) return;
    const matchedPlant = availablePlants.find(
        (plant) => plant.slug === plantFromURL
    );
    if (plantFromURL && !matchedPlant) {
        throw new URLError(
            'This plant is either non-existent or unavailable to you. Please double check your URL and make sure you have access to this plant'
        );
    }
    return matchedPlant;
};

export default matchPlantInURL;
