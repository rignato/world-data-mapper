import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata';

import express from 'express';
import mongoose from 'mongoose';
import * as _ from 'lodash';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
const xssClean = require('xss-clean');

import { UserResolvers } from './resolvers/userResolvers';

import { validateIncomingTokens } from './utils/auth';

import { buildSchema } from 'type-graphql';
import { MapResolvers } from './resolvers/mapResolvers';
import { RegionResolvers } from './resolvers/regionResolvers';
require('dotenv').config();
const { MONGO_URI, BACKEND_PORT, CLIENT_LOCAL_ORIGIN, SERVER_LOCAL_DOMAIN } = process.env;

const start = async () => {
    const schema = await buildSchema({
        resolvers: [UserResolvers, MapResolvers, RegionResolvers],
        emitSchemaFile: true,
        validate: false
    });
    const server = new ApolloServer({
        schema: schema,
        context: ({ req, res }) => ({ req, res })
    });

    try {
        await mongoose.connect(MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    const app = express();

    app.use(cors({
        origin: CLIENT_LOCAL_ORIGIN,
        credentials: true
    }));

    app.options('*', cors);

    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(mongoSanitize());
    app.use(xssClean());
    app.use(morgan('dev'));
    app.use(cookieParser());

    app.use(validateIncomingTokens);

    server.applyMiddleware({ app, cors: false });

    app.listen(BACKEND_PORT, () => {
        console.log(`Server ready at ${SERVER_LOCAL_DOMAIN}:${BACKEND_PORT}`);
    })
};

start();
