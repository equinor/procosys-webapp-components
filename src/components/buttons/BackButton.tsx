import { useLocation, useNavigate } from 'react-router-dom';
import removeSubdirectories from '../../utils/removeSubdirectories';
import EdsIcon from '../icons/EdsIcon';
import { NavButton } from '../NavBar';

type BackButtonProps = {
    to?: string;
};

const BackButton = ({ to }: BackButtonProps): JSX.Element => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    return (
        <NavButton
            variant="ghost"
            onClick={(): void => {
                if (to) {
                    navigate(to);
                } else {
                    navigate(removeSubdirectories(pathname, 1));
                }
            }}
        >
            <EdsIcon name={'arrow_back'} title="Back" />
            Back
        </NavButton>
    );
};

export default BackButton;
