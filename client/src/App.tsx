import React from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import { useQuery } from '@apollo/client';
import { GET_DB_USER } from './gql/queries';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import LayoutWrapper from './components/LayoutWrapper';
import Login from './components/Login';
import Register from './components/Register';


const App = () => {
  const { loading, error, data, refetch } = useQuery(GET_DB_USER);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <LayoutWrapper
            navbar
            body={
              <div className="container has-text-centered">
                <p className="title">
                  Welcome to the World Data Mapper.
              </p>
                <p className="subtitle">
                  To get started, login or sign up.
              </p>
              </div>
            }
          />
        </Route>
        <Route path="/login">
          <LayoutWrapper
            body={
              <Login />
            }
          />
        </Route>
        <Route path="/register">
          <LayoutWrapper
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
