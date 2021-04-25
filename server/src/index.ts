import { ApolloServer } from 'apollo-server-express';

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as xssClean from 'xss-clean';
import * as mongoSanitize from 'express-mongo-sanitize';

import { userDefs } from './typedefs/userDefs';
import { userResolvers } from './resolvers/userResolvers';

import { validateIncomingTokens } from './utils/auth';
require('dotenv').config();
const { MONGO_URI, BACKEND_PORT, CLIENT_LOCAL_ORIGIN, SERVER_LOCAL_DOMAIN } = process.env;

const start = async () => {
    const server = new ApolloServer({
        typeDefs: [userDefs],
        resolvers: _.merge({}, userResolvers),
        context: ({ req, res }) => ({ req, res })
    });

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
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

    app.listen(parseInt(BACKEND_PORT), () => {
        console.log(`Server ready at ${SERVER_LOCAL_DOMAIN}:${BACKEND_PORT}`);
    })
};

start();
