import "dotenv-safe/config"
import { COOKIE_NAME, __prod__ } from './constants'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { Post } from './entities/Post'
import path from 'path'
import { Updoot } from './entities/Updoot'
import { createUserLoader } from './utils/createUserLoader'
import { createUpdootLoader } from './utils/createUpdootLoader'
import process from "process"

const {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault
} = require('apollo-server-core')

const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: false,
        synchronize: true,
        migrations: [path.join(__dirname, './migrations/*') ],
        entities: [Post, User, Updoot]
    })

    await conn.runMigrations()

    /* await Post.delete({}) */

    const RedisStore = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL)

    const app = express();

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        })
    )

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis as any,
                disableTouch: true,
                disableTTL: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                sameSite: 'lax',
                secure: __prod__,
                domain: undefined
            },
            saveUninitialized: false,
            secret: process.env.SECRET,
            resave: false
        })
    )
    
    const apolloServer = new ApolloServer({
        plugins: [
            process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({
                embed: true,
                graphRef: 'plaid-gufzoj@current'
            })
            : ApolloServerPluginLandingPageLocalDefault({
                embed: true
            })
        ],
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader()
        })
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(parseInt(process.env.PORT), () => {
        console.log('server started on localhost:4000')
    })
}

main().catch(err => {
    console.error(err)
})