import { Response } from 'express';
import { RequestWithUserId } from '../utils/auth';
import { Resolver, Mutation, Query, Ctx, Arg, Int } from "type-graphql";

import { FilterQuery, Types } from 'mongoose';
import { IntResult, StatusResult } from '../schemas/Utils';
import { RegionModel, Regions, Map, Maps, RegionResult, Region, RegionInput, EditRegionInput, RegionViewResult, RegionPathResult, Landmarks } from '../schemas/Region';

@Resolver()
export class RegionResolvers {
    @Query(() => Regions, { nullable: false })
    async getRegions(
        @Arg("parentId", { nullable: false }) parentId: string,
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("perPage", () => Int, { defaultValue: 10 }) perPage: number,
        @Arg("sortBy", { nullable: true }) sortBy: string,
        @Arg("reversed", { nullable: true }) reversed: boolean,
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

        if (sortBy) {
            if (!['name', 'capital', 'leader'].includes(sortBy))
                return {
                    error: `Invalid sortBy key: ${sortBy}`
                };
            allRegions.sort((a, b) => a.toObject()[sortBy].localeCompare(b.toObject()[sortBy]) * (reversed ? -1 : 1));
        } else {
            allRegions.sort((a, b) => +a.createdAt - +b.createdAt);
        }

        const pageCount = Math.ceil(allRegions.length / perPage);

        const startOfPage = (page - 1) * perPage;

        const regionsInPage = allRegions.slice(startOfPage, startOfPage + perPage);

        return {
            regions: regionsInPage,
            totalPageCount: pageCount,
            displayPath: [...parent.displayPath, parent.name],
            path: [...parent.path, parent._id]
        }
    }
    @Query(() => RegionPathResult, { nullable: false })
    async getRegionPath(
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

        if (!region)
            return { error: `No region found with _id: ${_id} for current user` };

        return {
            _id: region._id,
            name: region.name,
            path: region.path,
            displayPath: region.displayPath
        };

    }

    @Query(() => RegionViewResult, { nullable: false })
    async getRegionById(
        @Arg("_id") _id: string,
        @Arg("sortBy", { nullable: true }) sortBy: string,
        @Arg("reversed", { nullable: true }) reversed: boolean,
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
            const allRegions = await RegionModel.find({
                ownerId: req.userId,
                path: region.path
            });
            if (sortBy) {
                if (!['name', 'capital', 'leader'].includes(sortBy))
                    return {
                        error: `Invalid sortBy key: ${sortBy}`
                    };
                allRegions.sort((a, b) => a.toObject()[sortBy].localeCompare(b.toObject()[sortBy]) * (reversed ? -1 : 1));
                console.log(allRegions.map((r) => ({ _id: r._id, name: r.name, capital: r.capital })));
            } else {
                allRegions.sort((a, b) => +a.createdAt - +b.createdAt);
            }

            let [previousSibling, nextSibling]: (Types.ObjectId | null)[] = [null, null];
            for (let i = 0; i < allRegions.length; i++) {
                if (allRegions[i]._id === region._id)
                    continue;
                if (i < allRegions.length - 1 && allRegions[i + 1]._id.equals(region._id)) {
                    previousSibling = allRegions[i]._id;
                    continue;
                }
                if (i > 0 && allRegions[i - 1]._id.equals(region._id)) {
                    nextSibling = allRegions[i]._id;
                    break;
                }
            }
            console.log(previousSibling, region._id, nextSibling)
            const childPathQuery = `path.${region.path.length}`;
            const subregionCount = await RegionModel.countDocuments({
                ownerId: req.userId,
                [childPathQuery]: region._id,
                path: { $size: region.path.length + 1 }
            });

            const pathQueries: { [x: string]: Types.ObjectId }[] = [];

            const parentPathQuery = `path.${region.path.length - 1}`;

            const possibleParentsQuery = {
                ownerId: req.userId,
                [parentPathQuery]: { $exists: false },
                $or: [{ path: { $size: 0 }, _id: region.path[0] }, ...region.path.slice(0, -1).map((_id, index) => {
                    const pathQuery = `path.${index}`;
                    pathQueries.push({ [pathQuery]: region.path[index] });
                    return { $and: [...pathQueries] };
                })]
            };

            // console.log(JSON.stringify(possibleParentsQuery, undefined, 2))

            const possibleParents = region.path.length > 0 ? await RegionModel.find(possibleParentsQuery) : [];

            return {
                ...region.toObject(),
                subregionCount: subregionCount,
                previousSibling: previousSibling,
                nextSibling: nextSibling,
                potentialParentNames: possibleParents.map((item) => item.name),
                potentialParentIds: possibleParents.map((item) => item._id)
            };
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
                displayPath: [...parent.displayPath, parent.name],
                createdAt: Date.now()
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
        @Arg("regionToEdit") regionToEdit: EditRegionInput,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const region = await RegionModel.findOneAndUpdate({
            _id: regionToEdit._id,
            ownerId: req.userId
        }, regionToEdit);

        if (region)
            return { success: true };
        return {
            success: false,
            error: `No region found with _id: ${regionToEdit._id}`
        }

    }

    @Mutation(() => StatusResult, { nullable: false })
    async changeParent(
        @Arg("_id") _id: string,
        @Arg("parentId") parentId: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const region = await RegionModel.findOne({
            _id: _id,
            ownerId: req.userId
        });

        if (!region)
            return {
                success: false,
                error: `No region found with _id: ${_id}`
            }

        const parent = await RegionModel.findOne({
            _id: parentId,
            ownerId: req.userId
        });

        if (!parent)
            return {
                success: false,
                error: `No parent found with _id: ${parentId}`
            }

        const newPath = [...parent.path, parent._id];
        const newDisplayPath = [...parent.displayPath, parent.name];

        await region.updateOne({
            path: newPath,
            displayPath: newDisplayPath,
            createdAt: Date.now()
        });

        return { success: true };
    }

    @Mutation(() => StatusResult, { nullable: false })
    async addLandmark(
        @Arg("_id") _id: string,
        @Arg("landmark") landmark: string,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                success: false,
                error: "No current user in session."
            };

        const region = await RegionModel.findOne({
            _id: _id,
            ownerId: req.userId
        });

        if (!region || !region.landmarks)
            return {
                success: false,
                error: `No region found with _id: ${_id}`
            }

        region.landmarks.push(landmark);
        await RegionModel.updateOne({
            _id: _id,
            ownerId: req.userId
        }, {
            landmarks: region.landmarks
        });

        return { success: true };
    }

    @Query(() => Landmarks, { nullable: false })
    async getLandmarks(
        @Arg("_id") _id: string,
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("perPage", () => Int, { defaultValue: 10 }) perPage: number,
        @Ctx("req") req: RequestWithUserId
    ) {
        if (!req.userId)
            return {
                error: "No current user in session."
            };

        const region = await RegionModel.findOne({
            _id: _id,
            ownerId: req.userId
        });

        if (!region || !region.landmarks)
            return {
                error: `No region found with _id: ${_id}`
            }

        const landmarks = region.landmarks.map((name) => ({
            name: name,
            owner: region._id
        }));

        const childPathQuery = `path.${region.path.length}`;

        const children = await RegionModel.find({
            ownerId: req.userId,
            [childPathQuery]: region._id
        }, { _id: 1, name: 1, landmarks: 1 });

        children.forEach((childRegion, index) => {
            if (!childRegion.landmarks)
                return;
            for (let landmarkName of childRegion.landmarks) {
                landmarks.push({
                    name: landmarkName,
                    owner: childRegion._id
                });
            }
        });

        const pageCount = Math.ceil(landmarks.length / perPage);

        const startOfPage = (page - 1) * perPage;

        const landmarksInPage = landmarks.slice(startOfPage, startOfPage + perPage);

        landmarks.sort((a, b) => a.name.localeCompare(b.name));

        return {
            landmarks: landmarksInPage,
            totalPageCount: pageCount
        }
    }
}