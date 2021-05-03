import { useLocation } from "react-router";

import Location from "react-router-dom";

const emailPattern = new RegExp("^[^@]+@[^@]+[.][^@]{2,}$");

export const validateEmail = (email: string) => {
    return emailPattern.test(email);
};

export const validatePassword = (password: string) => {
    return password.length >= 8;
};