import { StorageKey } from '../typings/enums';

const clearHomePlantAndProject = (): void => {
    window.localStorage.removeItem(StorageKey.PLANT);
    window.localStorage.removeItem(StorageKey.PROJECT);
};

export default clearHomePlantAndProject;
