import { Types } from 'mongoose';
import { Error } from './Utils';

import { ObjectType, Field, createUnionType, ID } from "type-graphql";
import { prop as Prop, getModelForClass, ModelOptions, Severity } from "@typegoose/typegoose";
import { Region } from './Region';
import { User } from './User';

@ObjectType()
@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Map {
    @Field(() => ID)
    @Prop()
    _id: Types.ObjectId;

    @Prop()
    owner_id: Types.ObjectId;

    @Field()
    @Prop()
    name: string;

    @Prop({ default: [] })
    children: Region[];
}


@ObjectType()
export class Maps {
    @Field(() => [Map])
    maps: Map[];

    @Field({ defaultValue: "" })
    error: string;
}

export const MapResult = createUnionType({
    name: 'MapResult',
    types: () => [Map, Error],
    resolveType: data => {
        if ("error" in data) {
            return Error;
        } else {
            return Map;
        }
    }
});

export const MapModel = getModelForClass(Map);