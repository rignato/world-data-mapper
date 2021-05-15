import { Types } from 'mongoose';
import { Error } from './Utils';

import { ObjectType, Field, createUnionType, ID, InputType } from "type-graphql";
import { index as Index, prop as Prop, getModelForClass, Severity, ModelOptions } from "@typegoose/typegoose";

@ObjectType()
export class Map {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;
}

@ObjectType()
export class Maps {
    @Field(() => [Map], { defaultValue: [] })
    maps: Map[];

    @Field({ defaultValue: "" })
    error: string;

    @Field({ defaultValue: 0 })
    totalPageCount: number;
}

@ObjectType()
@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Region {
    @Prop()
    @Field(() => ID)
    _id: Types.ObjectId;

    @Prop()
    ownerId: Types.ObjectId;

    @Prop({ default: () => Date.now() })
    @Field(() => Date)
    createdAt: Date

    @Field(() => [ID])
    @Prop(() => [Types.ObjectId])
    path: Types.ObjectId[];

    @Field(() => [String])
    @Prop(() => [String])
    displayPath: string[];

    @Field()
    @Prop()
    name: string;

    @Field()
    @Prop({ default: "" })
    capital?: string;

    @Field()
    @Prop({ default: "" })
    leader?: string;

    @Field(() => [String])
    @Prop({ default: [] })
    landmarks?: string[];

    @Field()
    subregionCount?: number;

    @Field(() => ID, { nullable: true })
    previousSibling?: Types.ObjectId;

    @Field(() => ID, { nullable: true })
    nextSibling?: Types.ObjectId;
}

@ObjectType()
export class Landmark {
    @Field()
    name: string;
    @Field(() => String)
    owner: Types.ObjectId;
}

@ObjectType()
export class Landmarks {
    @Field(() => [Landmark])
    landmarks: Landmark[];

    @Field({ defaultValue: "" })
    error: string;

    @Field({ defaultValue: 0 })
    totalPageCount: number;
}

@ObjectType()
export class RegionView {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field(() => Date)
    createdAt: Date

    @Field(() => [ID])
    path: Types.ObjectId[];

    @Field(() => [String])
    displayPath: string[];

    @Field()
    name: string;

    @Field()
    capital: string;

    @Field()
    leader: string;

    @Field(() => [String])
    landmarks: string[];

    @Field()
    subregionCount: number;

    @Field(() => ID, { nullable: true })
    previousSibling: Types.ObjectId;

    @Field(() => ID, { nullable: true })
    nextSibling: Types.ObjectId;

    @Field(() => [String])
    potentialParentNames: string[];

    @Field(() => [ID])
    potentialParentIds: Types.ObjectId[];
}

@InputType()
export class RegionInput {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field(() => [String])
    path: string[];

    @Field(() => [String])
    displayPath: string[];

    @Field()
    name: string;

    @Field()
    capital: string;

    @Field()
    leader: string;

    @Field(() => [String])
    landmarks: string[];

    @Field(() => Date)
    createdAt: Date
}

@InputType()
export class EditRegionInput {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field()
    name: string;

    @Field()
    capital: string;

    @Field()
    leader: string;
}

@ObjectType()
export class RegionPath {
    @Field(() => ID)
    _id: Types.ObjectId;

    @Field()
    name: string;

    @Field(() => [String])
    path: string[];

    @Field(() => [String])
    displayPath: string[];
}

@ObjectType()
export class Regions {
    @Field(() => [Region])
    regions: Region[];

    @Field({ defaultValue: "" })
    error: string;

    @Field({ defaultValue: 0 })
    totalPageCount: number;

    @Field(() => [String])
    displayPath?: string[]

    @Field(() => [ID])
    path?: Types.ObjectId[];
}

export const RegionResult = createUnionType({
    name: 'RegionResult',
    types: () => [Region, Error],
    resolveType: data => {
        if ("error" in data) {
            return Error;
        } else {
            return Region;
        }
    }
});

export const RegionViewResult = createUnionType({
    name: 'RegionViewResult',
    types: () => [RegionView, Error],
    resolveType: data => {
        if ("error" in data) {
            return Error;
        } else {
            return RegionView;
        }
    }
});

export const RegionPathResult = createUnionType({
    name: 'RegionPathResult',
    types: () => [RegionPath, Error],
    resolveType: data => {
        if ("error" in data) {
            return Error;
        } else {
            return RegionPath;
        }
    }
});

export const RegionModel = getModelForClass(Region);