import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

type Props = {

};

const Login = (props: Props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(false);

    const updateEmail = (e: React.FormEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const updatePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    const handleLogin = (e: React.MouseEvent<HTMLElement>) => {
        setError(true);
    };

    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-half">
                    <div className="notification">
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">
                                <input className="input" type="email" placeholder="Email" onChange={updateEmail} />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="password" placeholder="Password" onChange={updatePassword} />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                            </p>
                        </div>
                        {
                            error &&
                            <div className="field">
                                <label className="label help is-danger is-size-5 has-text-weight-light">Incorrect email or password.</label>
                            </div>
                        }

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-info" onClick={handleLogin} disabled={email.length === 0 || password.length === 0}>Login</button>
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