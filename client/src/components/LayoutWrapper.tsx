import React, { useEffect, useState } from 'react';
import { withRouter, useLocation } from 'react-router';


import Navbar from './Navbar';
import Logo from './Logo';

type LocationState = {
    message?: string,
    messageColor?: string
};

type Props = {
    navbar?: boolean,
    titleText?: string,
    body: React.ReactNode
};

const LayoutWrapper = ({ navbar, titleText, body }: Props) => {

    let location = useLocation<LocationState>();

    const [showMessage, setShowMessage] = useState(true);

    const handleHideMessage = () => {
        setShowMessage(false);
    };

    return (
        <section className="hero welcome-screen is-dark is-fullheight ">
            {
                location.state && showMessage &&
                <div className={`notification is-${location.state.messageColor || "info"} is-light columns is-centered is-size-5`}>
                    <div className="column"></div>
                    <div className="column has-text-centered">
                        {location.state.message}
                    </div>
                    <div className="column">
                        <button className="delete is-medium" onClick={handleHideMessage} />
                    </div>

                </div>

            }
            {navbar &&
                <div className="hero-head">
                    <Navbar />
                </div>
            }


            <div className="hero-body">
                <div className="container">
                    {
                        navbar ||
                        <div className="title has-text-centered">
                            <div className="is-size-1"><Logo /></div>
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