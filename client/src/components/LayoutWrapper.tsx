import React from 'react';

import Navbar from './Navbar';
import Logo from './Logo';

type Props = {
    navbar?: boolean,
    body: React.ReactNode
};

const LayoutWrapper = ({ navbar, body }: Props) => {
    return (
        <section className="hero is-dark is-fullheight ">
            {navbar &&
                <div className="hero-head">
                    <Navbar />
                </div>
            }


            <div className="hero-body">
                <div className="container">
                    {
                        navbar ||
                        <h1 className="title has-text-centered">
                            <Logo />
                        </h1>
                    }
                    {body}
                </div>

            </div>
        </section>
    );
};

export default LayoutWrapper;