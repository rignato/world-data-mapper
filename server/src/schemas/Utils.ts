import { ObjectType, Field, createUnionType } from "type-graphql";

@ObjectType()
export class Error {
    @Field()
    error: string;
}

@ObjectType()
export class StatusResult {
    @Field()
    success: boolean;

    @Field({ defaultValue: "" })
    error: string;
}
