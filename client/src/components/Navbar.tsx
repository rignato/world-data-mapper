import React from 'react';
import { Link } from 'react-router-dom';

import Logo from './Logo';

import { UserResult, ILogout, IGetUser } from '../types/User';

import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';

import { LOGOUT } from '../gql/userMutations';

import { useHistory } from "react-router";

type Props = {
  user?: UserResult;
  refetchUser: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetUser>>
};

const Navbar = ({ user, refetchUser }: Props) => {

  const history = useHistory();

  const [logout] = useMutation<ILogout>(LOGOUT);

  const handleLogout = async () => {
    const { data } = await logout();

    if (!data) {
      console.error("Unknown error occurred during logout");
    }

    await refetchUser();

    history.push('/');
  }

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
              {
                (!user || "error" in user)
                  ?
                  <div className="buttons has-text-weight-semibold level">
                    <Link className="button level-item is-light is-outlined" to="/register">
                      Sign up
                  </Link>
                    <Link className="button level-item is-info" to="/login">
                      Login
                  </Link>
                  </div>
                  :
                  <div className="level">
                    <Link className="navbar-item level-item is-size-6 has-text-light semi-rounded has-text-weight-semibold" to="/register">
                      {user.name}
                    </Link>
                    <div className="level-item px-6"></div>
                    <button className="button level-item is-info has-text-weight-semibold" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
              }

            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;