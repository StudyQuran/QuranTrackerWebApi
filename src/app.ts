import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import Config from './config/index'
import Routes from './routes'
import { AuthRoutes } from './auth/auth.routes'
import Init from './config/Init'
import connectRedis from 'connect-redis'
import session from 'express-session'
import SwaggerJson from './config/swagger.json'
import 'reflect-metadata'

const startServer = () => {
    const app = express()
    const RedisStore = connectRedis(session)
    Init.TypeORMConnection
    app.use(express.json())
    app.use(cors())
    app.use(
        session({
            name: 'QuranTrackerCokkie',
            store: new RedisStore({ client: Init.RedisClient }),
            secret: Config.Env.session.COOKIE_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 10
            }
        })
    )
    app.use(morgan('dev'))
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerJson))
    app.use('/', Routes.HomeRoutes)
    app.use('/auth', AuthRoutes)
    app.use('/test', Routes.TestRoutes)
    app.use(Config.Errors.Error404)
    app.use(Config.Errors.ErrorHandlder)

    app.listen(Config.Env.server.PORT, () => console.log(`Server on => http://localhost:${Config.Env.server.PORT}`))
}

startServer()
