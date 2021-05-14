import { useLocation } from "react-router";

import Location from "react-router-dom";

const emailPattern = new RegExp("^[^@]+@[^@]+[.][^@]{2,}$");

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