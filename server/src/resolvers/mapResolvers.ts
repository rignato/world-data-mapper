import { Response } from 'express';
import { RequestWithUserId } from '../utils/auth';
import { Resolver, Mutation, Query, Ctx, Arg, Int, } from "type-graphql";

import { Types } from 'mongoose';
import { RegionModel, Maps } from '../schemas/Region';
import { IntResult, StatusResult } from '../schemas/Utils';

@Resolver()
export class MapResolvers {
    @Query((returns) => Maps, { nullable: false })
    async getMaps(
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("perPage", () => Int, { defaultValue: 10 }) perPage: number,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                error: "No current user in session."
            };

        const totalMaps = await RegionModel.find({
            ownerId: req.userId,
            path: []
        });

        const pageCount = Math.ceil(totalMaps.length / perPage);

        const startOfPage = (page - 1) * perPage;

        const maps = totalMaps.slice(startOfPage, startOfPage + perPage);

        return {
            maps: maps,
            totalPageCount: pageCount
        };
    }

    @Mutation((returns) => StatusResult, { nullable: false })
    async addMap(
        @Arg("name") name: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const mapId = new Types.ObjectId();

        await RegionModel.create({
            _id: mapId,
            ownerId: req.userId,
            path: [],
            displayPath: [],
            name: name
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

        const mapId = Types.ObjectId(_id);

        const mapAndChildren = await RegionModel.deleteMany({
            $or: [{
                ownerId: req.userId,
                _id: mapId
            }, {
                ownerId: req.userId,
                "path.0": mapId
            }]

        });
        if (mapAndChildren)
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

        const mapId = Types.ObjectId(_id);

        const map = await RegionModel.findOneAndUpdate({
            ownerId: req.userId,
            _id: mapId
        }, {
            name: name
        });

        if (!map)
            return {
                success: false,
                error: `No map found with _id: ${_id} for current user`
            };

        await RegionModel.updateMany({
            ownerId: req.userId,
            "path.0": mapId
        }, {
            "displayPath.0": name
        });

        return {
            success: true
        };
    }
}