import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import Logo from './Logo';

import { UserResult, ILogout, IGetUser } from '../types/User';

import { ApolloQueryResult, OperationVariables, useMutation, useQuery } from '@apollo/client';

import { LOGOUT } from '../gql/userMutations';

import { useHistory } from "react-router";
import { IGetRegionById, Region } from '../types/Region';
import { GET_REGION_BY_ID } from '../gql/regionQueries';

type Props = {
  user?: UserResult;
  refetchUser: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetUser>>
};

type Params = {
  mapId: string;
}

const Navbar = ({ user, refetchUser }: Props) => {

  const history = useHistory();

  const routeParams = useParams<Params>();

  let location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const [parentId, setParentId] = useState(
    searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId
  );

  const { data: regionData, refetch: refetchRegionData } = useQuery<IGetRegionById>(GET_REGION_BY_ID, {
    variables: { _id: parentId },
    skip: !parentId
  });

  useEffect(() => {
    if (parentId)
      (async () => {
        await refetchRegionData();
      })()
  }, [parentId, refetchRegionData]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newParentId = searchParams.get("subregion") ? searchParams.get("subregion") : routeParams.mapId;
    setParentId(newParentId);
  }, [location, routeParams.mapId]);



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
          {
            parentId && regionData && "displayPath" in regionData.getRegionById &&
            (<span className="navbar-start">
              <span className="navbar-item"></span>
              <span className="navbar-item"></span>
              <nav className="navbar-item breadcrumb is-centered" aria-label="breadcrumbs">
                <ul>
                  {
                    regionData.getRegionById.displayPath.concat(regionData.getRegionById.name).map((regionName, index) => (
                      <li>
                        <Link to={{
                          pathname: `/maps/${index === 0 && (regionData.getRegionById as Region).path.length === 0 ? (regionData.getRegionById as Region)._id : (regionData.getRegionById as Region).path[0]}`,
                          search: `${index === 0 ? "" :
                            `?subregion=${index === (regionData.getRegionById as Region).path.length
                              ?
                              (regionData.getRegionById as Region)._id
                              :
                              (regionData.getRegionById as Region).path[index]
                            }`}`
                        }}>
                          <button className="button has-text-light is-ghost has-text-weight-semibold">
                            {regionName}
                          </button>
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </nav>
            </span>)
          }

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
                    <Link className="navbar-item level-item is-size-6 has-text-light semi-rounded has-text-weight-semibold" to="/account">
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