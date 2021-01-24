import express from 'express'
import AuthService from '../controllers/auth/auth.services'
import Config from '../config/enviormentVariables'
import Settings from '../Json/settings.json'

export const HomeRoutes = express.Router()

HomeRoutes.get('/', async (req, res, next) => {
  res.json({
    name: Settings.ProjectName,
    version: Settings.ProjectVersion,
    port: Config.server.PORT
  })
})
HomeRoutes.get('/auth', AuthService.JWT.verifyAccessTokenMiddleware, async (req, res, next) => {
  res.json({
    name: Settings.ProjectName,
    secrect: 'Secret',
    version: Settings.ProjectVersion,
    port: Config.server.PORT
  })
})
