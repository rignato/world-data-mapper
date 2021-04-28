import { Types } from 'mongoose';
import { Error } from './Utils';

import { ObjectType, Field, createUnionType } from "type-graphql";
import { prop as Prop, getModelForClass } from "@typegoose/typegoose";

@ObjectType()
export class User {
    @Prop()
    _id: Types.ObjectId;

    @Field()
    @Prop()
    name: string;

    @Field()
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    refreshCount: number;
}

export const UserResult = createUnionType({
    name: 'UserResult',
    types: () => [User, Error],
    resolveType: data => {
        if ("errorMessage" in data) {
            return Error;
        } else {
            return User;
        }
    }
});

export const UserModel = getModelForClass(User);