import { Response } from 'express';
import { RequestWithUserId } from '../utils/auth';
import { Resolver, Mutation, Query, Ctx, Arg } from "type-graphql";

import { Types } from 'mongoose';
import { Map, MapModel, Maps } from '../schemas/Map';
import { StatusResult } from '../schemas/Utils';

@Resolver()
export class MapResolvers {
    @Query((returns) => Maps, { nullable: false })
    async getAllMaps(@Ctx("req") req: RequestWithUserId) {
        if (!req.userId)
            return {
                maps: [],
                error: "No current user in session."
            };

        const maps = await MapModel.find({ owner_id: req.userId });
        return { maps: maps };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async addMap(@Ctx("req") req: RequestWithUserId) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };
        await MapModel.create({
            owner_id: req.userId,
            _id: new Types.ObjectId(),
            name: "New map",
            children: []
        });
        return { success: true };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async deleteMap(
        @Arg("_id", { nullable: false }) _id: string,
        @Ctx("req") req: RequestWithUserId,
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };
        const map = await MapModel.findOneAndDelete({
            _id: _id,
            owner_id: req.userId
        });
        if (map)
            return { success: true };

        return {
            success: false,
            error: `No map found with _id: ${_id} for current user`
        };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async renameMap(
        @Arg("_id", { nullable: false }) _id: string,
        @Arg("name", { nullable: false }) name: string,
        @Ctx("req") req: RequestWithUserId,
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const map = await MapModel.findOneAndUpdate({ _id: _id, owner_id: req.userId }, { name: name });
        if (map)
            return { success: true };

        return {
            success: false,
            error: `No map found with _id: ${_id} for current user`
        };
    }
}