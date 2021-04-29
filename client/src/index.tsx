import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
require('dotenv').config();
const { REACT_APP_BACKEND_PORT } = process.env;

console.log(process.env);

const cache = new InMemoryCache({

	/*
		The cache object ids are generated using the objectID(a string) instead
		of the number id so that objects are refered to consistently across the
		client and server
	*/
	dataIdFromObject: object => `${object.__typename}:${object._id}`,
	typePolicies: {
		Query: {
			fields: {
				getAllEntries: {
					merge(existing, incoming) {
						return incoming
					}
				},
			},
		},
	},
});

// bad hardcoding, localhost port should match port in the backend's .env file
const BACKEND_LOCATION = `http://localhost:${REACT_APP_BACKEND_PORT}/graphql`;

const client = new ApolloClient({
	uri: BACKEND_LOCATION,
	// Credentials: include is necessary to pass along the auth cookies with each server request
	credentials: 'include',
	cache: cache,
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
