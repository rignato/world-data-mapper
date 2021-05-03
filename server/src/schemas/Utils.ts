import { ObjectType, Field, Int } from "type-graphql";

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

@ObjectType()
export class IntResult {
    @Field(() => Int)
    result: Number;

    @Field({ defaultValue: "" })
    error: string;
}