import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const Logo = () => {
    return (
        <span className="icon-text has-text-centered">
            <span className="icon">
                <FontAwesomeIcon icon={faGlobe} />
            </span>
            <span className="has-text-weight-medium">
                wdm
            </span>
        </span>
    );
};

export default Logo;