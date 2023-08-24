import { LocalStorage, OfflineStatus } from '../typings/enums';

export const getOfflineStatusfromLocalStorage = (): OfflineStatus => {
    const offlineStatus = localStorage.getItem(LocalStorage.OFFLINE_STATUS);
    if (offlineStatus == null) return OfflineStatus.ONLINE;
    const offlineStatusNum = parseInt(offlineStatus);
    if (offlineStatusNum in OfflineStatus) {
        return offlineStatusNum;
    }
    return OfflineStatus.ONLINE;
};
