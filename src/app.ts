import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import Config from './config/index'
import Routes from './routes'
import Init from './config/Init'
import 'reflect-metadata'

const startServer = () => {
  const app = express()
  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())
  app.use(morgan('dev'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(Init.swaggerDocs))
  app.use('/', Routes.HomeRoutes)
  app.use('/auth', Routes.AuthRoutes)
  app.use('/testdata', Routes.TestDataRoutes)
  app.use(Config.Errors.Error404)
  app.use(Config.Errors.ErrorHandlder)

  app.listen(Config.Env.server.PORT, () => console.log(`Server on => http://localhost:${Config.Env.server.PORT}`))
}

startServer()

//TYPEORM_SYNCHRONIZE = true
