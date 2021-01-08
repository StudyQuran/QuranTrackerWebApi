import express from 'express'
import AuthService from '../auth/auth.services'
import Config from '../config/enviormentVariables'
import Settings from '../settings.json'

export const HomeRoutes = express.Router()

HomeRoutes.get('/', async (req, res, next) => {
  res.json({
    name: Settings.ProjectName,
    version: Settings.ProjectVersion,
    port: Config.server.PORT
  })
})
HomeRoutes.get('/auth', AuthService.JWT.verifyAccessToken, async (req, res, next) => {
  res.json({
    name: Settings.ProjectName,
    secrect: 'Secret',
    version: Settings.ProjectVersion,
    port: Config.server.PORT
  })
})
