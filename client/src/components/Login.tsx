import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import { useHistory } from "react-router";

import { IGetUser, ILogin } from '../types/User';

import { LOGIN } from '../gql/userMutations';

type Props = {
    refetchUser: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetUser>>
};

const Login = ({ refetchUser }: Props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [login] = useMutation<ILogin>(LOGIN);

    let history = useHistory();

    const updateEmail = (e: React.FormEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const updatePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    const handleLogin = async () => {
        setLoading(true);
        const { data } = await login({ variables: { email: email, password: password } });
        setLoading(false);

        if (!data) {
            setError("Unknown error occurred, please try again");
            return;
        }

        const user = data.login;

        if ("error" in user) {
            setError(user.error);
            return;
        }
        await refetchUser();
        history.push("/maps", {
            justLoggedIn: true
        });
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
                            error.length > 0 &&
                            <div className="field">
                                <label className="label help is-danger is-size-5 has-text-weight-light">{error}</label>
                            </div>
                        }

                        <div className="field is-grouped">
                            <div className="control">
                                <button className={`button is-info ${loading ? "is-loading" : ""}`} onClick={handleLogin} disabled={email.length === 0 || password.length === 0}>Login</button>
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