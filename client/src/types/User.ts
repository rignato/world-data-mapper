export type User = {
    name: string;
    email: string;
}

export type Error = {
    error: string;
}

export type StatusResult = {
    success: boolean;
    error?: string;
}

export type UserResult = User | Error;

export type GetUser = {
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