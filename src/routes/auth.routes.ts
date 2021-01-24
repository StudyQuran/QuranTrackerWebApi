import express from 'express'
import AuthController from '../controllers/auth/auth.controller'

export const AuthRoutes = express.Router()

/**
 * @swagger
 * /auth/adminsignup:
 *  post:
 *    description: Sign up admin users
 *    parameters:
 *      - name: schoolName
 *        in: formData
 *        required: false
 *        type: string
 *      - name: schoolLocation
 *        in: formData
 *        required: false
 *        type: string
 *      - name: schoolType
 *        in: formData
 *        required: false
 *        type: string
 *      - name: firstName
 *        in: formData
 *        required: true
 *        type: string
 *      - name: lastName
 *        in: formData
 *        required: true
 *        type: string
 *      - name: email
 *        in: formData
 *        required: true
 *        type: string
 *      - name: password
 *        in: formData
 *        required: true
 *        type: string
 *      - name: accType
 *        in: formData
 *        required: true
 *        type: enum
 *    responses:
 *      '200':
 *        description: An admin account was successfully created
 */
AuthRoutes.post('/adminsignup', AuthController.adminSingUp)
/**
 * @swagger
 * /auth/signup:
 *  post:
 *    description: Sign up users
 *    responses:
 *      '200':
 *        description: An account was successfully created
 */
AuthRoutes.post('/signup', AuthController.SingUp)
/**
 * @swagger
 * /auth/verifyemail/:userName/:randomString:
 *  get:
 *    description: Send verify emial
 *    responses:
 *      '200':
 *        description: Email was successfully sent
 */
AuthRoutes.get('/verifyemail/:userName/:randomString', AuthController.verifyEmail)
/**
 * @swagger
 * /auth/forgotpassword:
 *  post:
 *    description: Send email to rest password
 *    responses:
 *      '200':
 *        description: Email was successfully sent
 */
AuthRoutes.post('/forgotpassword', AuthController.forgotPassword)
/**
 * @swagger
 * /auth/changepassword:
 *  patch:
 *    description: Change password
 *    responses:
 *      '200':
 *        description: Password was successfully changed
 */
AuthRoutes.patch('/changepassword', AuthController.changePassword)
/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: Login users
 *    produces:
 *     - application/json
 *    responses:
 *      '200':
 *        description: A user successfully logged in
 */
AuthRoutes.post('/login', AuthController.login)
/**
 * @swagger
 * /auth/onclientload:
 *  post:
 *    description: Check refresh-token and create new tokens in accsess token is expired
 *    produces:
 *     - application/json
 *    responses:
 *      '200':
 *        description: Refresh-token is valid and successfully created new tokens
 */
AuthRoutes.post('/onclientload', AuthController.onClientLoad)
/**
 * @swagger
 * /auth/logout:
 *  delete:
 *    description: Logout a user
 *    responses:
 *      '200':
 *        description: User was successfully logged out
 */
AuthRoutes.delete('/logout', AuthController.logout)
