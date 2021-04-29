import { Response } from 'express';
import { RequestWithUserId } from '../utils/auth';
import { Resolver, Mutation, Query, Ctx, Arg } from "type-graphql";
import * as bcrypt from "bcryptjs";
import { generateTokens } from '../utils/auth';

import { UserResult, UserModel, User } from '../schemas/User';
import { StatusResult, Error } from '../schemas/Utils';
import { Types } from 'mongoose';
require('dotenv').config();
const { SALT_LENGTH } = process.env;

@Resolver()
export class UserResolvers {
    @Query((returns) => UserResult, { nullable: false })
    async getUser(@Ctx("req") req: RequestWithUserId) {
        if (!req.userId)
            return { error: "No current user in session." };
        const user = await UserModel.findById(req.userId);
        if (user)
            return user;
        else
            return { error: "User not found." }
    }

    @Mutation((returns) => UserResult, { nullable: false })
    async login(
        @Arg("email", { nullable: false }) email: string,
        @Arg("password", { nullable: false }) password: string,
        @Ctx("res") res: Response
    ) {
        const user = await UserModel.findOne({ email: email.toLocaleLowerCase() });
        if (!user)
            return { error: "Incorrect email or password." };

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return { error: "Incorrect email or password." };

        const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.refreshCount);
        res.cookie('access-token', accessToken, { httpOnly: true, sameSite: 'none', secure: true });
        res.cookie('refresh-token', refreshToken, { httpOnly: true, sameSite: 'none', secure: true });

        return user;
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async logout(@Ctx("res") res: Response) {
        res.clearCookie('access-token');
        res.clearCookie('refresh-token');
        return { success: true };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async register(
        @Arg("name", { nullable: false }) name: string,
        @Arg("email", { nullable: false }) email: string,
        @Arg("password", { nullable: false }) password: string
    ) {
        const exists = await UserModel.findOne({ email: email.toLocaleLowerCase() });
        if (exists)
            return {
                success: false,
                error: "An account already exists with this email address."
            };

        const hashedPassword = await bcrypt.hash(password, parseInt(SALT_LENGTH!));
        await UserModel.create({
            _id: new Types.ObjectId(),
            name: name,
            email: email.toLocaleLowerCase(),
            password: hashedPassword,
            refreshCount: 0
        });

        return { success: true };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async update(
        @Arg("name", { nullable: false }) name: string,
        @Arg("email", { nullable: false }) email: string,
        @Arg("password", { nullable: false }) password: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        const user = await UserModel.findById(req.userId);

        if (!user)
            return {
                success: false,
                error: "User not found."
            };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            return {
                success: false,
                error: "Invalid password."
            };

        const updateSuccess = await UserModel.updateOne({ _id: req.userId }, {
            name: name,
            email: email.toLocaleLowerCase()
        });

        if (updateSuccess)
            return { success: true };
        else
            return {
                success: false,
                error: "Error updating account info."
            };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async updatePassword(
        @Arg("oldPassword", { nullable: false }) oldPassword: string,
        @Arg("newPassword", { nullable: false }) newPassword: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        const user = await UserModel.findById(req.userId);

        if (!user)
            return {
                success: false,
                error: "User not found."
            };

        const validPassword = await bcrypt.compare(oldPassword, user.password);

        if (!validPassword)
            return {
                success: false,
                error: "Invalid old password."
            };

        const hashedNewPassword = await bcrypt.hash(newPassword, parseInt(SALT_LENGTH!));

        const updateSuccess = await UserModel.updateOne({ _id: req.userId }, {
            password: hashedNewPassword
        });

        if (updateSuccess)
            return { success: true };
        else
            return {
                success: false,
                error: "Error updating password."
            };
    }
}

