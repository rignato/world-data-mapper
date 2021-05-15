import React, { useEffect, useState } from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import LayoutWrapper from './components/LayoutWrapper';
import Register from './components/Register';
import Login from './components/Login';
import { useQuery } from '@apollo/client';
import { IGetUser, User } from './types/User';
import { GET_USER } from './gql/userQueries';
import Loader from 'react-loader-spinner';
import MapSelect from './components/MapSelect';
import RegionTable from './components/RegionTable';
import RegionViewer from './components/RegionViewer';
import UpdateAccount from './components/UpdateAccount';
import { useTPS } from './utils/tps';

const App = () => {

  const { data: userData, loading: userLoading, error: userError, refetch: refetchUser } = useQuery<IGetUser>(GET_USER);

  const tps = useTPS();

  const [path, setPath] = useState<string[]>([]);
  const [displayPath, setDisplayPath] = useState<string[]>([]);

  const [loadingStart, setLoadingStart] = useState(userLoading);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [loadingEnd, setLoadingEnd] = useState(false);

  useEffect(() => {
    if (!userLoading) {
      setLoadingStart(false);
      setFadeOut(true);
    }
  }, [userLoading]);

  useEffect(() => {
    if (fadeOut) {
      setTimeout(() => {
        setFadeOut(false);
        setLoadingEnd(true);
        setFadeIn(true);
      }, 500);
    }
  }, [fadeOut]);

  useEffect(() => {
    if (fadeIn) {
      setTimeout(() => {
        setFadeIn(false);
      }, 500);
    }
  }, [fadeIn]);


  return (
    <BrowserRouter>
      <Switch>
        {
          !userLoading && (!userData?.getUser || ("error" in userData?.getUser))
            ?
            <Redirect exact from="/maps" to={{ pathname: "/" }} />
            :
            <Redirect exact from="/" to={{ pathname: "/maps" }} />
        }


        <Route exact path="/">
          <LayoutWrapper
            navbar
            user={userData?.getUser}
            refetchUser={refetchUser}
            showGlobe={userLoading ? false : !userData?.getUser || ("error" in userData?.getUser)}
            path={path}
            displayPath={displayPath}
            body={
              <div className="container has-text-centered" >
                <p className="title has-text-weight-medium">
                  Welcome to the World Data Mapper.
                </p>
                <p className="subtitle has-text-weight-light">
                  To get started, login or create an account.
              </p>
              </div>

            }
          />
        </Route>
        <Route exact path="/maps">
          <LayoutWrapper
            navbar={!userLoading && loadingEnd}
            user={userData?.getUser}
            refetchUser={refetchUser}
            pageLoadingScreen
            userLoading={userLoading}
            loadingStart={loadingStart}
            loadingEnd={loadingEnd}
            fadeOut={fadeOut}
            path={path}
            displayPath={displayPath}
            body={<MapSelect user={userData?.getUser} fadeIn={fadeIn} />}
          />
        </Route>

        <Route exact path="/maps/:mapId">
          <LayoutWrapper
            navbar={!userLoading && loadingEnd}
            user={userData?.getUser}
            refetchUser={refetchUser}
            pageLoadingScreen
            userLoading={userLoading}
            loadingStart={loadingStart}
            loadingEnd={loadingEnd}
            fadeOut={fadeOut}
            path={path}
            displayPath={displayPath}
            body={<RegionTable tps={tps} setPath={setPath} setDisplayPath={setDisplayPath} />}
          />
        </Route>

        <Route exact path="/maps/:mapId/view">
          <LayoutWrapper
            navbar={!userLoading && loadingEnd}
            user={userData?.getUser}
            refetchUser={refetchUser}
            pageLoadingScreen
            userLoading={userLoading}
            loadingStart={loadingStart}
            loadingEnd={loadingEnd}
            fadeOut={fadeOut}
            path={path}
            displayPath={displayPath}
            body={<RegionViewer tps={tps} setPath={setPath} setDisplayPath={setDisplayPath} />}
          />
        </Route>

        <Route path="/login">
          <LayoutWrapper
            user={userData?.getUser}
            refetchUser={refetchUser}
            titleText="Login to your account."
            showGlobe
            path={path}
            displayPath={displayPath}
            body={
              <Login refetchUser={refetchUser} />
            }
          />
        </Route>
        <Route path="/register">
          <LayoutWrapper
            user={userData?.getUser}
            refetchUser={refetchUser}
            titleText="Create an account."
            showGlobe
            path={path}
            displayPath={displayPath}
            body={
              <Register />
            }
          />
        </Route>
        {
          (!userLoading && (!userData?.getUser || ("error" in userData?.getUser))) ?
            <Redirect exact from="/account" to={{ pathname: "/login" }} /> :
            <Route path="/account">
              <LayoutWrapper
                user={userData?.getUser}
                refetchUser={refetchUser}
                titleText="Update your account info."
                showGlobe
                path={path}
                displayPath={displayPath}
                body={
                  <UpdateAccount user={userData?.getUser as User} refetch={refetchUser} />
                }
              />
            </Route>
        }

      </Switch>
    </BrowserRouter>
  );
}

export default App;
