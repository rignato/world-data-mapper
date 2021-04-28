import React from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import { useQuery } from '@apollo/client';
import { GET_DB_USER } from './gql/userQueries';
import { BrowserRouter, Switch, Route, Redirect, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { StaticContext } from 'react-router';

import LayoutWrapper from './components/LayoutWrapper';
import Register from './components/Register';
import Login from './components/Login';

type LocationState = {
  message?: string,
  messageColor?: string
};

const App = () => {
  // const { loading, error, data, refetch } = useQuery(GET_DB_USER);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <LayoutWrapper
            navbar
            body={
              <div className="container has-text-centered" >
                <p className="title has-text-weight-medium">
                  Welcome to the World Data Mapper.
                </p>
                <p className="subtitle has-text-weight-light">
                  To get started, login or sign up.
              </p>
              </div>
            }
          />
        </Route>
        <Route path="/login">
          <LayoutWrapper
            titleText="Login to your account."
            body={
              <Login />
            }
          />
        </Route>
        <Route path="/register">
          <LayoutWrapper
            titleText="Create an account."
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
