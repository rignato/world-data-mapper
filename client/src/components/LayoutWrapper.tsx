import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { ApolloQueryResult, OperationVariables, useQuery } from '@apollo/client';

import { IGetUser, UserResult } from '../types/User';

import { GET_USER } from '../gql/userQueries';


import Navbar from './Navbar';
import Logo from './Logo';
import Loader from 'react-loader-spinner';

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
    pageLoadingScreen?: boolean,
    userLoading?: boolean,
    loadingStart?: boolean,
    loadingEnd?: boolean,
    fadeOut?: boolean
};

const LayoutWrapper = ({
    navbar,
    titleText,
    body,
    user,
    refetchUser,
    showGlobe,
    fadeIn,
    pageLoadingScreen,
    userLoading,
    loadingStart,
    loadingEnd,
    fadeOut
}: Props) => {

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
                    {
                        pageLoadingScreen ? (
                            (userLoading || loadingStart) && !loadingEnd ?
                                <div className="container has-text-centered" >
                                    <Loader color="#FFF" type="ThreeDots" />
                                </div>
                                : (fadeOut || !loadingEnd) ?
                                    <div className="container has-text-centered fade-out" >
                                        <Loader color="#FFF" type="ThreeDots" />
                                    </div>
                                    : body
                        ) : body

                    }
                </div>

            </div>
        </section >
    );
};

export default LayoutWrapper;