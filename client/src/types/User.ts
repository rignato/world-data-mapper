import { Error, StatusResult } from './Utils';

export type User = {
    name: string;
    email: string;
};

export type UserResult = User | Error;

export type IGetUser = {
    getUser: UserResult;
};

export type ILogin = {
    login: UserResult;
};

export type ILogout = {
    logout: StatusResult;
};

export type IRegister = {
    register: StatusResult;
};

export type IUpdate = {
    update: StatusResult;
};

export type IUpdatePassword = {
    updatePassword: StatusResult;
};