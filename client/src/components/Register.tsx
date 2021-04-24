import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

type Props = {

};

const Register = (props: Props) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");


    const handleChangePasswordVisibility = (e: React.MouseEvent<HTMLElement>) => {
        setPasswordVisible(!passwordVisible);
    };

    const updatePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    }

    const updateConfirmedPassword = (e: React.FormEvent<HTMLInputElement>) => {
        setConfirmedPassword(e.currentTarget.value);
    }

    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-half">
                    <div className="notification">
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="text" placeholder="Name" />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input" type="email" placeholder="Email" />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                            </p>
                        </div>
                        <div className="field" >
                            <p className="control has-icons-left has-icons-right">
                                <input
                                    className="input"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={updatePassword}
                                />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                <span className="icon click-icon is-small is-right" onClick={handleChangePasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={passwordVisible ? faEyeSlash : faEye}
                                    />
                                </span>
                            </p>
                        </div>
                        <div className="field" >
                            <p className="control has-icons-left has-icons-right">
                                <input
                                    className={`input ${password === "" ?
                                        "" :
                                        password === confirmedPassword ? "is-success" : "is-danger"
                                        }`}
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={updateConfirmedPassword}
                                />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                {
                                    password !== "" &&
                                    <span className="icon click-icon is-small is-right">
                                        <FontAwesomeIcon
                                            icon={password === confirmedPassword ? faCheck : faExclamationTriangle}
                                        />
                                    </span>
                                }
                                {
                                    password !== "" && password !== confirmedPassword && <p className="help is-danger">Passwords must match</p>
                                }

                            </p>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-info">Register</button>
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

export default Register;