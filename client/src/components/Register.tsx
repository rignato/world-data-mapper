import React, { useState } from 'react';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import InputWithValidation from './InputWithValidation';
import { validateEmail, validatePassword } from '../utils/utils';
import { useHistory } from "react-router";

import { IRegister } from '../types/User';
import { REGISTER } from '../gql/userMutations';
import { useMutation } from '@apollo/client';

type LocationState = {
    message?: string,
    messageColor?: string
};

type Props = {

};

const Register = (props: Props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [nameValid, setNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmedPasswordValid, setConfirmedPasswordValid] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    let history = useHistory<LocationState>();

    const [register] = useMutation<IRegister>(REGISTER);

    const handleRegister = async () => {
        console.log(nameValid);
        console.log(emailValid);
        console.log(passwordValid);
        console.log(confirmedPasswordValid);
        setLoading(true);
        const { data } = await register({
            variables: {
                name: name,
                email: email,
                password: password
            }
        });
        if (!data) {
            setError("Unknown error occurred, please try again");
            return;
        }
        setLoading(false);

        const registerStatus = data.register;

        if (registerStatus.error) {
            setError(registerStatus.error)
            return;
        }
        history.push("/", {
            message: "Account created successfully. Login to get started!",
            messageColor: "info"
        });
    };

    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-half">
                    <div className="notification">
                        <InputWithValidation
                            leftIcon={faUser}
                            type="text"
                            placeholder="Name"
                            onChange={setName}
                            validator={(s: string) => { return s.length > 0 }}
                            onValidChange={(valid: boolean) => { setNameValid(valid) }}
                            invalidMessage="Name is required"
                        />
                        <InputWithValidation
                            leftIcon={faEnvelope}
                            type="email"
                            placeholder="Email"
                            validator={validateEmail}
                            onChange={(email) => {
                                setEmail(email);
                                setError("");
                            }}
                            onValidChange={(valid: boolean) => { setEmailValid(valid) }}
                            invalidMessage={error ? "" : "Email must be valid email address"}
                            overrideMessage={error.length > 0}
                            error={error}
                        />
                        <InputWithValidation
                            leftIcon={faLock}
                            placeholder="Password"
                            validator={validatePassword}
                            onChange={setPassword}
                            onValidChange={(valid: boolean) => { setPasswordValid(valid) }}
                            invalidMessage="Password must be at least 8 characters"
                            passwordViewToggle
                        />
                        <InputWithValidation
                            leftIcon={faLock}
                            type="password"
                            placeholder="Confirm Password"
                            validator={(confirmedPassword: String) => { return password.length > 0 && confirmedPassword === password }}
                            onValidChange={(valid: boolean) => { setConfirmedPasswordValid(valid) }}
                            invalidMessage="Passwords must match"
                            overrideMessage
                        />
                        {
                            error.length > 0 &&
                            <div className="field">
                                <label className="label help is-danger is-size-5 has-text-weight-light">{error}</label>
                            </div>
                        }

                        <div className="field is-grouped">
                            <div className="control">
                                <button
                                    className={`button is-info ${loading ? "is-loading" : ""}`}
                                    onClick={handleRegister}
                                    disabled={!error && !(nameValid && emailValid && passwordValid && confirmedPasswordValid)}
                                >
                                    Register
                                </button>
                            </div>
                            <div className="control">
                                {
                                    loading
                                        ?
                                        <button className="button is-light" disabled>Cancel</button>
                                        :
                                        <Link className="button is-light" to="/">Cancel</Link>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Register;