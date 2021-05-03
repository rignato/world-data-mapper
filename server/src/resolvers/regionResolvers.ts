import { Response } from 'express';
import { RequestWithUserId } from '../utils/auth';
import { Resolver, Mutation, Query, Ctx, Arg, Int } from "type-graphql";

import { Types } from 'mongoose';
import { IntResult, StatusResult } from '../schemas/Utils';
import { RegionModel, Regions, Map, Maps, RegionResult, Region } from '../schemas/Region';

@Resolver()
export class RegionResolvers {
    @Query(() => Regions, { nullable: false })
    async getRegions(
        @Arg("parentId", { nullable: false }) parentId: string,
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("perPage", () => Int, { defaultValue: 10 }) perPage: number,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                error: "No current user in session."
            };

        const parent = await RegionModel.findOne({
            ownerId: req.userId,
            _id: Types.ObjectId(parentId)
        });

        if (!parent)
            return {
                error: `No region found with _id: ${parentId} for current user`
            }

        const childPathQuery = `path.${parent.path.length}`;

        console.log(childPathQuery)

        const allRegions = await RegionModel.find({
            ownerId: req.userId,
            [childPathQuery]: parent._id,
            path: { $size: parent.path.length + 1 }
        });

        const pageCount = Math.ceil(allRegions.length / perPage);

        const startOfPage = (page - 1) * perPage;

        const regionsInPage = allRegions.slice(startOfPage, startOfPage + perPage);

        return {
            regions: regionsInPage,
            totalPageCount: pageCount,
            displayPath: [...parent.displayPath, parent.name]
        }
    }

    @Query(() => RegionResult, { nullable: false })
    async getRegionById(
        @Arg("_id") _id: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                error: "No current user in session."
            };

        const region = await RegionModel.findOne({
            _id: Types.ObjectId(_id),
            ownerId: req.userId
        });
        if (region) {
            console.log(region)
            const childPathQuery = `path.${region.path.length}`;
            const subregionCount = await RegionModel.count({
                ownerId: req.userId,
                [childPathQuery]: region._id,
                path: { $size: region.path.length + 1 }
            });

            const ret = { ...region.toObject(), subregionCount: subregionCount };
            console.log(ret);
            return ret;
        }





        return { error: `No region found with _id: ${_id} for current user` };

    }

    @Mutation(() => StatusResult, { nullable: false })
    async addRegion(
        @Arg("parentId") parentId: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const parent = await RegionModel.findOne({
            _id: Types.ObjectId(parentId),
            ownerId: req.userId
        });

        if (!parent)
            return {
                success: false,
                error: `No parent found with _id: ${parentId} for current user`
            };

        const regionId = new Types.ObjectId();

        await RegionModel.create({
            _id: regionId,
            ownerId: req.userId,
            name: "New region",
            capital: "New capital",
            leader: "New leader",
            path: [...parent.path, parent._id],
            displayPath: [...parent.displayPath, parent.name]
        });

        return { success: true };
    }
}