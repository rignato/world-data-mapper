import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

type Props = {
    text?: boolean
}

const Logo = ({ text }: Props) => {
    return (
        <span className="icon-text has-text-centered">
            <span className="icon">
                <FontAwesomeIcon icon={faGlobe} />
            </span>
            {text &&
                <span className="has-text-weight-medium">
                    wdm
            </span>}
        </span>
    );
};

export default Logo;