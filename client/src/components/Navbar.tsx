import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

type Props = {

};

const Navbar = (props: Props) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item is-size-4" to="/">
            < Logo text />
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <span className="navbar-item">
              <div className="buttons has-text-weight-semibold">
                <Link className="button is-light is-outlined" to="/register">
                  Sign up
                </Link>
                <Link className="button is-info" to="/login">
                  Login
                </Link>
              </div>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;