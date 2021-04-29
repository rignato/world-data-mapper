import React, { useEffect, useState } from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import LayoutWrapper from './components/LayoutWrapper';
import Register from './components/Register';
import Login from './components/Login';
import { useQuery } from '@apollo/client';
import { IGetUser } from './types/User';
import { GET_USER } from './gql/userQueries';
import Loader from 'react-loader-spinner';
import MapSelect from './components/MapSelect';

const App = () => {

  const { data: userData, loading: userLoading, error: userError, refetch: refetchUser } = useQuery<IGetUser>(GET_USER);

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
      }, 1000);
    }
  }, [fadeOut]);

  useEffect(() => {
    if (fadeIn) {
      setTimeout(() => {
        setFadeIn(false);
      }, 1000);
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
            centered
            navbar={!userLoading && loadingEnd}
            user={userData?.getUser}
            refetchUser={refetchUser}
            body={
              (userLoading || loadingStart) && !loadingEnd ?
                <div className="container has-text-centered" >
                  <Loader color="#FFF" type="ThreeDots" />
                </div>
                : (fadeOut || !loadingEnd) ?
                  <div className="container has-text-centered fade-out" >
                    <Loader color="#FFF" type="ThreeDots" />
                  </div>
                  :
                  <MapSelect user={userData?.getUser} fadeIn={fadeIn} />
            }
          />
        </Route>
        <Route path="/login">
          <LayoutWrapper
            user={userData?.getUser}
            refetchUser={refetchUser}
            titleText="Login to your account."
            showGlobe
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
            body={
              <Register />
            }
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
