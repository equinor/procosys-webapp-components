import { CustomCheckItem } from '../services/apiTypes';

type UpdateCustomCheckProps = {
    value: boolean;
    checkItemId: number;
    setItems: React.Dispatch<React.SetStateAction<CustomCheckItem[]>>;
};

const updateCustomCheck = ({
    value,
    checkItemId,
    setItems,
}: UpdateCustomCheckProps): void => {
    setItems((items) =>
        items.map((existingItem) =>
            existingItem.id === checkItemId
                ? { ...existingItem, isOk: value }
                : existingItem
        )
    );
};

export default updateCustomCheck;
