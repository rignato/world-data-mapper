import { Types } from 'mongoose';
import { Error } from './Utils';

import { ObjectType, Field, createUnionType } from "type-graphql";
import { prop as Prop, getModelForClass } from "@typegoose/typegoose";

@ObjectType()
export class Region {
    @Prop()
    _id: Types.ObjectId;

    @Field()
    @Prop()
    name: string;

    @Field()
    @Prop()
    capital: string;

    @Field()
    @Prop()
    leader: string;

    @Field()
    @Prop({ default: [] })
    landmarks: string[];

    @Field()
    @Prop({ default: [] })
    children: Region[];
}

export const RegionModel = getModelForClass(Region);