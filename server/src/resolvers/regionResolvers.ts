import { Response } from 'express';
import { RequestWithUserId } from '../utils/auth';
import { Resolver, Mutation, Query, Ctx, Arg, Int } from "type-graphql";

import { Types } from 'mongoose';
import { IntResult, StatusResult } from '../schemas/Utils';
import { RegionModel, Regions, Map, Maps, RegionResult, Region, RegionInput, EditRegionInput } from '../schemas/Region';

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
            const childPathQuery = `path.${region.path.length}`;
            const subregionCount = await RegionModel.count({
                ownerId: req.userId,
                [childPathQuery]: region._id,
                path: { $size: region.path.length + 1 }
            });

            return { ...region.toObject(), subregionCount: subregionCount };
        }

        return { error: `No region found with _id: ${_id} for current user` };

    }

    @Mutation(() => RegionResult, { nullable: false })
    async addRegion(
        @Arg("parentId") parentId: string,
        @Ctx("req") req: RequestWithUserId,
        @Arg("region", () => RegionInput, { nullable: true }) region?: RegionInput
    ) {
        if (!req.userId)
            return {
                error: "No current user in session."
            };

        const parent = await RegionModel.findOne({
            _id: Types.ObjectId(parentId),
            ownerId: req.userId
        });

        if (!parent)
            return {
                error: `No parent found with _id: ${parentId} for current user`
            };

        const regionId = new Types.ObjectId();

        if (!region) {
            return await RegionModel.create({
                _id: regionId,
                ownerId: req.userId,
                name: "New region",
                capital: "New capital",
                leader: "New leader",
                path: [...parent.path, parent._id],
                displayPath: [...parent.displayPath, parent.name]
            });
        }

        const { path, ...regionWithoutPath } = region;

        return await RegionModel.create({
            ...regionWithoutPath,
            path: region.path.map((id) => Types.ObjectId(id)),
            ownerId: req.userId
        });
    }

    @Mutation(() => StatusResult, { nullable: false })
    async deleteRegion(
        @Arg("_id") _id: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const region = await RegionModel.findOne({
            _id: Types.ObjectId(_id),
            ownerId: req.userId
        });

        if (!region || region.path.length == 0)
            return {
                success: false,
                error: `No region found with _id: ${_id} for current user`
            };

        const childPathQuery = `path.${region.path.length}`;

        const regionAndChildren = await RegionModel.deleteMany({
            $or: [{
                ownerId: req.userId,
                _id: region._id
            }, {
                ownerId: req.userId,
                [childPathQuery]: region._id
            }]

        });
        if (regionAndChildren)
            return { success: true };

        return {
            success: false,
            error: `Error deleting region with _id: ${_id}`
        };
    }

    @Mutation(() => StatusResult, { nullable: false })
    async editRegion(
        @Arg("editRegion") editRegion: EditRegionInput,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const region = await RegionModel.findOneAndUpdate({
            _id: editRegion._id,
            ownerId: req.userId
        }, editRegion);

        if (region)
            return { success: true };
        return {
            success: false,
            error: `No region found with _id: ${editRegion._id}`
        }

    }
}