import { Project } from '../typings/apiTypes';
import { URLError } from './matchPlantInURL';

const matchProjectInURL = (
    availableProjects: Project[],
    projectInURL: string
): Project => {
    const matchedProject = availableProjects.find(
        (project) => project.title === projectInURL
    );
    if (!matchedProject) {
        throw new URLError(
            'This project is either non-existent or unavailable to you. Please double check your URL and make sure you have access to this project'
        );
    }
    return matchedProject;
};

export default matchProjectInURL;
