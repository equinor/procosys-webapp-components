import { CheckItem } from '../services/apiTypes';

type UpdateNAProps = {
    value: boolean;
    checkItemId: number;
    setItems: React.Dispatch<React.SetStateAction<CheckItem[]>>;
};

const updateNA = ({ value, checkItemId, setItems }: UpdateNAProps): void => {
    setItems((items) =>
        items.map((existingItem) =>
            existingItem.id === checkItemId
                ? { ...existingItem, isNotApplicable: value }
                : existingItem
        )
    );
};

export default updateNA;
