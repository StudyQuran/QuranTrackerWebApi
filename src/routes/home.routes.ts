import express from 'express'
import AuthService from '../auth/auth.service'
import Config from '../config/enviormentVariables'
import Settings from '../config/swagger.json'

export const HomeRoutes = express.Router()

HomeRoutes.get('/', async (req, res, next) => {
    res.json({
        name: Settings.info.title,
        version: Settings.info.version,
        port: Config.server.PORT
    })
})
HomeRoutes.get('/auth', AuthService.JWT.verifyAccessToken, async (req, res, next) => {
    res.json({
        name: Settings.info.title,
        secrect: 'Secret',
        version: Settings.info.version,
        port: Config.server.PORT
    })
})
HomeRoutes.get('/status', async (req, res, next) => {
    res.json({
        name: Settings.info.title,
        status: 'running',
        version: Settings.info.version,
        port: Config.server.PORT
    })
})
