import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { ApolloQueryResult, OperationVariables, useQuery } from '@apollo/client';

import { IGetUser, UserResult } from '../types/User';

import { GET_USER } from '../gql/userQueries';


import Navbar from './Navbar';
import Logo from './Logo';

type LocationState = {
    message?: string,
    messageColor?: string,
    justLoggedIn?: boolean
};

type Props = {
    navbar?: boolean,
    titleText?: string,
    body: React.ReactNode,
    user?: UserResult,
    refetchUser: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetUser>>,
    showGlobe?: boolean,
    fadeIn?: boolean,
    centered?: boolean
};

const LayoutWrapper = ({ navbar, titleText, body, user, refetchUser, showGlobe, fadeIn, centered }: Props) => {

    let location = useLocation<LocationState>();

    const [showMessage, setShowMessage] = useState(true);

    const handleHideMessage = () => {
        setShowMessage(false);
    };

    return (
        <section className={`hero \
        ${location.state && location.state.justLoggedIn ? "loaded" : ""} \
        ${showGlobe || (location.state && location.state.justLoggedIn) ? "welcome-screen" : ""} \
        ${fadeIn ? "fade-in" : ""} \
        is-dark is-fullheight
        `}>
            {
                location.state && location.state.message && showMessage &&
                <div className={`level notification is-${location.state.messageColor || "info"} is-light columns is-centered is-size-5`}>
                    <div className="level-item column"></div>
                    <div className="level-item column has-text-centered">
                        {location.state.message}
                    </div>
                    <div className="level-item column">
                        <button className="delete is-medium" onClick={handleHideMessage} />
                    </div>

                </div>

            }
            {
                navbar &&
                <div className="hero-head">
                    <Navbar user={user} refetchUser={refetchUser} />
                </div>
            }


            <div className="hero-body">
                <div className="container is-max-desktop">
                    {
                        navbar ||
                        <div className="title has-text-centered">
                            {showGlobe && <div className="is-size-1"><Logo /></div>}

                            <div className="is-size-4 has-text-weight-light">{titleText}</div>
                        </div>
                    }
                    {body}
                </div>

            </div>
        </section >
    );
};

export default LayoutWrapper;