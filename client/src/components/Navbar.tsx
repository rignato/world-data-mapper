import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

type Props = {

};

const Navbar = (props: Props) => {
    return (
        <nav className="navbar">
              <div className="container">
                <div className="navbar-brand">
                  <a className="navbar-item icon-text is-size-3">
                    <span className="icon">
                        <FontAwesomeIcon icon={faGlobe} />
                    </span>
                    <span className="has-text-weight-medium">
                        wdm
                    </span>
                  </a>
                </div>
                <div className="navbar-menu">
                  <div className="navbar-end">
                    <span className="navbar-item">
                      <div className="buttons has-text-weight-semibold">
                        <button className="button is-light is-outlined">
                            Sign up
                        </button>
                        <button className="button is-light">
                          Login
                        </button>
                        </div>
                    </span>
                  </div>
                </div>
              </div>
            </nav>
    );
};

export default Navbar;