import React from 'react';

import Navbar from './Navbar';

const LayoutWrapper = ({ children }: {children: React.ReactNode }) => {
    return (
        <section className="hero is-dark is-fullheight">
          <div className="hero-head">
            <Navbar />
          </div>

          <div className="hero-body">
            { children }
          </div>
        </section>
    );   
};

export default LayoutWrapper;