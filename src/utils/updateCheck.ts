import { CheckItem } from '../services/apiTypes';

type UpdateCheckProps = {
    value: boolean;
    checkItemId: number;
    setItems: React.Dispatch<React.SetStateAction<CheckItem[]>>;
};

const updateCheck = ({
    value,
    checkItemId,
    setItems,
}: UpdateCheckProps): void => {
    setItems((items) =>
        items.map((existingItem) =>
            existingItem.id === checkItemId
                ? { ...existingItem, isOk: value }
                : existingItem
        )
    );
};

export default updateCheck;
