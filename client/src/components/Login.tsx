import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

type Props = {

};

const Login = (props: Props) => {
    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-half">
                    <div className="notification">
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="email" placeholder="Email" />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" placeholder="Password" />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                            </p>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-info">Login</button>
                            </div>
                            <div className="control">
                                <Link className="button is-light" to="/">Cancel</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;