import { Request, Response, NextFunction } from 'express';
import { sign, verify } from "jsonwebtoken";
import { Types } from 'mongoose';
import { UserModel } from '../schemas/User';
require('dotenv').config();
const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = process.env;

export type RequestWithUserId = { userId?: Types.ObjectId } & Request;

type Token = {
    userId: Types.ObjectId,
    refreshCount: number
};

type DataWithUserId = Token & object;

const validateToken = (token: string, secret: string) => {
    try {
        const data = verify(token, secret) as DataWithUserId;
        return { userId: data.userId, refreshCount: data.refreshCount };
    } catch {
        return null;
    }
};

export const generateTokens = (userId: Types.ObjectId, refreshCount: number) => {
    const refreshToken = sign(
        { userId: userId, refreshCount: refreshCount },
        REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
    );

    const accessToken = sign(
        { userId: userId },
        ACCESS_TOKEN_SECRET!,
        { expiresIn: "1h" }
    );

    return { accessToken, refreshToken };
};

export const validateIncomingTokens = async (req: RequestWithUserId, res: Response, next: NextFunction) => {
    const incomingAccessToken = req.cookies["access-token"];
    const incomingRefreshToken = req.cookies["refresh-token"];

    if (!incomingAccessToken && !incomingRefreshToken)
        return next();

    // console.log(`incoming access token: ${incomingAccessToken}`);
    // console.log(`incoming refresh token: ${incomingRefreshToken}`);

    // Try to validate access token
    let data = validateToken(incomingAccessToken, ACCESS_TOKEN_SECRET!);

    // If it validates attach the userId to request and go to next middleware function
    if (data !== null) {
        req.userId = data.userId;
        return next();
    }

    // If it fails and there's no refresh token
    if (!incomingRefreshToken)
        return next();

    // If it fails try to validate refresh token
    data = validateToken(incomingRefreshToken, REFRESH_TOKEN_SECRET!);

    // If it fails again, we go to next middleware function
    if (data === null)
        return next();

    // If it validates successfully, check if user is valid 

    const user = await UserModel.findById(data.userId);

    // If user invalid or token invalid (refresh count doesn't match)
    if (!user || data.refreshCount !== user.refreshCount)
        return next();

    // Update refresh count for that user
    await UserModel.updateOne({ _id: data.userId }, { refreshCount: data.refreshCount + 1 });

    // Generate new tokens
    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = generateTokens(data.userId, data.refreshCount + 1);

    // Set cookies and attach userId to request
    res.cookie('refresh-token', newRefreshToken, { httpOnly: true, sameSite: 'none', secure: true });
    res.cookie('access-token', newAccessToken, { httpOnly: true, sameSite: 'none', secure: true });
    req.userId = data.userId;

    next();
};