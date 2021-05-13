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
export class Regions {
    @Field(() => [Region], { defaultValue: [] })
    regions: Region[];

    @Field({ defaultValue: "" })
    error: string;

    @Field({ defaultValue: 0 })
    totalPageCount: number;

    @Field(() => [String], { defaultValue: [] })
    displayPath?: string[]
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

export const RegionModel = getModelForClass(Region);