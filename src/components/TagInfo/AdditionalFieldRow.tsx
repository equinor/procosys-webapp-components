import { InfoRowWrapper } from './InfoRow';

const isValidValue = (value: string | null): boolean => {
    if (typeof value === 'string' && value.length > 0) return true;
    return false;
};

type AdditionalFieldRowProps = {
    label: string;
    value: string | null;
    unit: string | null;
};

const AdditionalFieldRow = ({
    label,
    value,
    unit
}: AdditionalFieldRowProps): JSX.Element => {
    return (
        <InfoRowWrapper>
            <label>{label}</label>
            <p>
                {isValidValue(value) ? value : '-'}{' '}
                {isValidValue(value) && isValidValue(unit) ? unit : ''}
            </p>
        </InfoRowWrapper>
    );
};

export default AdditionalFieldRow;
