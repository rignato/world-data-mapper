import React, { useEffect, useState } from 'react';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import InputWithValidation from './InputWithValidation';
import { validateEmail, validatePassword } from '../utils/utils';
import { useHistory } from "react-router";

import { IGetUser, IRegister, IUpdate, IUpdatePassword, User } from '../types/User';
import { REGISTER, UPDATE, UPDATE_PASSWORD } from '../gql/userMutations';
import { ApolloQueryResult, OperationVariables, useMutation } from '@apollo/client';
import Loader from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type LocationState = {
    message?: string,
    messageColor?: string
};

type Props = {
    user: User;
    refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<IGetUser>>;
};

const UpdateAccount = ({ user, refetch }: Props) => {
    const [name, setName] = useState(user ? user.name : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmedPasswordValid, setConfirmedPasswordValid] = useState(true);
    const [oldPasswordValid, setOldPasswordValid] = useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    let history = useHistory<LocationState>();

    const [update] = useMutation<IUpdate>(UPDATE);
    const [updatePassword] = useMutation<IUpdatePassword>(UPDATE_PASSWORD);

    const handleUpdate = async () => {
        console.log(nameValid);
        console.log(emailValid);
        console.log(passwordValid);
        console.log(confirmedPasswordValid);
        setLoading(true);
        const { data: updateData } = await update({
            variables: {
                name: name,
                email: email,
                password: oldPassword
            }
        });
        if (!updateData) {
            setLoading(false);
            setError("Unknown error occurred, please try again");
            return;
        }

        const updateStatus = updateData.update;

        if (updateStatus.error) {
            setLoading(false);
            setError(updateStatus.error)
            return;
        }
        if (password.length === 0) {
            setLoading(false);
            await refetch();
            history.push('/');
            return;
        }

        const { data: updatePasswordData } = await updatePassword({
            variables: {
                oldPassword: oldPassword,
                newPassword: password
            }
        });

        setLoading(false);

        if (!updatePasswordData) {
            setError("Unknown error occurred, please try again");
            return;
        }

        const updatePasswordStatus = updatePasswordData.updatePassword;

        if (updatePasswordStatus.error) {
            setError(updatePasswordStatus.error);
            return;
        }
        await refetch();
        history.push("/");
    };

    useEffect(() => {
        if (error.toLocaleLowerCase().includes("password"))
            setOldPasswordValid(false);
        else if (error.toLocaleLowerCase().includes("email"))
            setEmailValid(false);

    }, [error]);

    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-half">
                    {user
                        ?
                        <div className="notification">
                            <div className="field"><label className="label is-large">Your Info</label></div>
                            <InputWithValidation
                                leftIcon={faUser}
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={setName}
                                validator={(s: string) => { return s.length > 0 }}
                                onValidChange={(valid: boolean) => { setNameValid(valid) }}
                                invalidMessage="Name is required"
                            />
                            <InputWithValidation
                                leftIcon={faEnvelope}
                                type="email"
                                placeholder="Email"
                                value={email}
                                validator={(email: string) => {
                                    return validateEmail(email) && emailValid;
                                }}
                                onChange={(email) => {
                                    setEmail(email);
                                    setError("");
                                    setEmailValid(true);
                                }}
                                onValidChange={(valid: boolean) => { setEmailValid(valid) }}
                                invalidMessage={error ? "" : "Email must be valid email address"}
                                overrideMessage={error.length > 0}
                                error={emailValid ? "" : error}
                            />
                            <div className="field"><label className="label is-large">Change Password</label></div>
                            <div className="field"><label className="label is-small">Leave blank if you don't want to change it.</label></div>
                            <InputWithValidation
                                leftIcon={faLock}
                                placeholder="New Password"
                                validator={(password: string) => {
                                    return validatePassword(password) || password.length === 0;
                                }}
                                onChange={setPassword}
                                onValidChange={(valid: boolean) => { setPasswordValid(valid) }}
                                invalidMessage="Password must be at least 8 characters"
                                passwordViewToggle
                            />
                            <InputWithValidation
                                leftIcon={faLock}
                                type="password"
                                placeholder="Confirm New Password"
                                validator={(confirmedPassword: string) => { return confirmedPassword === password }}
                                onValidChange={(valid: boolean) => { setConfirmedPasswordValid(valid) }}
                                invalidMessage="New passwords must match"
                                overrideMessage
                            />
                            <div className="field"><label className="label is-large">Confirm Password</label></div>
                            <div className="field"><label className="label is-small">Your current password is needed to confirm your changes.</label></div>
                            <InputWithValidation
                                leftIcon={faLock}
                                type="password"
                                placeholder="Current Password"
                                validator={() => { return oldPasswordValid; }}
                                onChange={(oldPassword) => {
                                    setOldPassword(oldPassword);
                                    setError("");
                                    setOldPasswordValid(true);
                                }}
                                value={oldPassword}
                                onValidChange={(valid: boolean) => { setOldPasswordValid(valid) }}
                                invalidMessage=""
                                overrideMessage={error.length > 0}
                                error={oldPasswordValid ? "" : error}
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
                                        onClick={handleUpdate}
                                        disabled={!error && !(nameValid && emailValid && (passwordValid || password === "") && confirmedPasswordValid && oldPassword.length > 0)}
                                    >
                                        Update
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
                        :
                        <div className="notification ">
                            <div className="section is-flex is-justify-content-center">
                                <Loader color="hsl(0, 0%, 86%)" type="ThreeDots" />
                            </div>
                        </div>
                    }


                </div>
            </div>
        </div>

    );
};

export default UpdateAccount;