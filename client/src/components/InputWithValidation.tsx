import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

type Props = {
    leftIcon: IconDefinition,
    type?: string,
    placeholder: string,
    validator: (s: string) => boolean,
    onChange?: (s: string) => void,
    onValidChange: (valid: boolean) => void,
    invalidMessage: string,
    passwordViewToggle?: boolean,
    overrideMessage?: boolean,
    error?: string
};

const InputWithValidation = (props: Props) => {

    const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    const [edited, setEdited] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleChangePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const updateValue = (e: React.FormEvent<HTMLInputElement>) => {
        if (!edited)
            setEdited(true);
        setValue(e.currentTarget.value);
        if (props.onChange)
            props.onChange(e.currentTarget.value);
    };

    useEffect(() => {
        const isValid = props.validator(value);
        setValid(isValid);
        props.onValidChange(isValid);
    }, [props, value]);

    return (
        <div className="field">
            <p className="control has-icons-left has-icons-right">
                <input
                    className={`input ${valid && !props.error ? "" : (edited || props.error ? "is-danger" : "")}`}
                    type={props.passwordViewToggle ? (passwordVisible ? "text" : "password") : (props.type || "text")}
                    placeholder={props.placeholder}
                    onChange={updateValue}
                />
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={props.leftIcon} />
                </span>
                {
                    props.passwordViewToggle
                        ?
                        <span className="icon click-icon is-small is-right" onClick={handleChangePasswordVisibility}>
                            <FontAwesomeIcon
                                icon={passwordVisible ? faEyeSlash : faEye}
                            />
                        </span>
                        :
                        edited && (!valid || props.error) &&
                        <span className="icon is-small is-right">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                            />
                        </span>
                }
                {
                    (props.error || (edited && !valid)) && <span className="help is-danger">{!props.overrideMessage && value.length === 0 ? `${props.placeholder} is required` : props.invalidMessage}</span>
                }
            </p>
        </div>
    );
};

export default InputWithValidation;