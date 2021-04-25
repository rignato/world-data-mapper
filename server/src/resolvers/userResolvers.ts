import * as bcrypt from "bcryptjs";

import { generateTokens } from '../utils/auth';

import * as mongoose from 'mongoose';
import User from '../models/user-model';

export const userResolvers = {
    Query: {
        getUser: async (_, __, { req }) => {
            if (!req.userId)
                return null;
            return User.findById(req.userId);
        }
    },
    Mutation: {
        login: async (_, { email, password }, { res }) => {
            const user = await User.findOne({ email: email });
            if (!user)
                return null;

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword)
                return null;

            const { accessToken, refreshToken } = generateTokens(user._id, user.refresh_count);

            res.cookie('access-token', accessToken, { httpOnly: true, sameSite: 'none', secure: true });
            res.cookie('refresh-token', refreshToken, { httpOnly: true, sameSite: 'none', secure: true });

            return user;
        },
        logout: (_, __, { res }) => {
            res.clearCookie('access-token');
            res.clearCookie('refresh-token');
            return true;
        },
        register: async (_, { name, email, password }) => {
            const exists = await User.findOne({ email: email });
            if (exists)
                return false;

            const hashedPassword = await bcrypt.hash(password, 16);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                email: email,
                password: hashedPassword,
                refresh_count: 0
            });

            await user.save();

            return true;
        }
    }
};

