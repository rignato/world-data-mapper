import React from 'react';
import 'bulma/css/bulma.css';
import { useQuery } 	from '@apollo/client';
import { GET_DB_USER } from './gql/queries';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import LayoutWrapper from './components/LayoutWrapper';


const App = () => {
  const { loading, error, data, refetch } = useQuery(GET_DB_USER);

  return (
    <BrowserRouter>
      <Switch>
        <Route 
          path="/"
          render={
            () => 
            <LayoutWrapper> 
              <div className="container has-text-centered">
                <p className="title">
                  Welcome to the World Data Mapper.
                </p>
                <p className="subtitle">
                  To get started, login or sign up.
                </p>
              </div>
               
            </LayoutWrapper>
          }
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
