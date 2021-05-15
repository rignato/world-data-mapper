import { useLocation } from "react-router";

import Location from "react-router-dom";

const emailPattern = new RegExp("^[^@]+@[^@]+[.][^@]{2,}$");

export const validateName = (name: string) => {
    return name.length > 0 && name.replace(/\s/g, '').length > 0;
}

export const validateEmail = (email: string) => {
    return emailPattern.test(email);
};

export const validatePassword = (password: string) => {
    return password.length >= 8;
};

export const gqlSanitizeInput = (object: any) => {
    if (!object)
        return object;
    const { __typename, ...gqlSanitized } = object;
    return gqlSanitized;
};

export const truncateString = (s: string, len: number) => {
    if (s.length <= len)
        return s;
    return s.slice(0, len - 4).concat(" ...");
};

export const getFlagURL = (displayPath: string[], regionName = "") => {
    return encodeURI(`/flags/${displayPath.join('/')}${regionName.length > 0 ? `/${regionName}` : ""} Flag.png`);
};