import express from 'express'
import AuthController from '../auth/auth.controller'

export const AuthRoutes = express.Router()

AuthRoutes.post('/adminsignup', AuthController.adminSingUp)

AuthRoutes.post('/signup', AuthController.SingUp)

AuthRoutes.get('/verifyemail/:userName/:randomString', AuthController.verifyEmail)

AuthRoutes.post('/forgotpassword', AuthController.forgotPassword)

AuthRoutes.patch('/changepassword', AuthController.changePassword)

AuthRoutes.post('/login', AuthController.login)

AuthRoutes.post('/refresh-token', AuthController.refreshToken)

AuthRoutes.delete('/logout', AuthController.logout)
