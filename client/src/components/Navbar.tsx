import { Link } from 'react-router-dom';

import Logo from './Logo';

import { UserResult, ILogout, IGetUser } from '../types/User';

import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';

import { LOGOUT } from '../gql/userMutations';

import { useHistory } from "react-router";
import { usePaginate } from './Pagination';
import { useEffect } from 'react';

type Props = {
  user?: UserResult;
  refetchUser: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetUser>>
  path: string[];
  displayPath: string[];
};

const Navbar = ({ user, refetchUser, path, displayPath }: Props) => {

  let history = useHistory();

  const [logout] = useMutation<ILogout>(LOGOUT);

  const handleLogout = async () => {
    const { data } = await logout();

    if (!data) {
      console.error("Unknown error occurred during logout");
    }

    await refetchUser();

    history.push('/');
  }

  const { pages, updatePages } = usePaginate(path.length - 1, path.length, 1);

  useEffect(() => {
    updatePages(path.length - 1, path.length, 1);
  }, [path, displayPath, updatePages]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item is-size-4" to="/">
            < Logo text />
          </Link>
        </div>
        <div className="navbar-menu">
          <span className="navbar-start">
            <span className="navbar-item"></span>
            <span className="navbar-item"></span>
            <nav className="navbar-item breadcrumb is-centered" aria-label="breadcrumbs">
              <ul>
                {
                  pages.map((page) => page === '...' ? -1 : parseInt(page) - 1).map((page) => (
                    page < 0 ?
                      <li key={`${page}-${path[page]}`}>
                        <div className="has-text-light has-text-weight-semibold mt-4 px-4">
                          ...
                        </div>
                      </li>
                      :
                      <li>
                        <Link to={{
                          pathname: `/maps/${path[page]}`,
                          search: `${page === 0 ? "" :
                            `?subregion=${path[page]}`}`
                        }}>
                          <button className="button has-text-light is-ghost has-text-weight-semibold" autoFocus={false}>
                            {displayPath[page]}
                          </button>
                        </Link>
                      </li>
                  ))
                }
              </ul>
            </nav>
          </span>

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
                    <button className="navbar-item button is-ghost level-item is-size-6 has-text-light semi-rounded has-text-weight-semibold" onClick={() => history.push('/account')}>
                      {user.name}
                    </button>
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