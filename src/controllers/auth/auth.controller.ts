import express from 'express'
import createError from 'http-errors'
import Redis from '../../config/Init/initRedis'
import Gmail from '../../auth/gmail'
import AuthServices from './auth.services'
import generator from 'generate-password'
import { getRepository } from 'typeorm'
import AuthValidation from '../../auth/auth.validation'
import Models from '../../models'

export default {
  adminApply: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const accInfo: AdminApplySchema = await AuthValidation.AdminApplySchema.validateAsync(req.body)
      await Gmail.ApplyEmail(accInfo)
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  },
  adminSingUp: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      //Validate request (Check 1)
      const { schoolName, schoolLocation, schoolType, firstName, lastName, userName, email }: AdminSignUpSchema = await AuthValidation.AdminSingUpSchema.validateAsync(req.body)
      const schoolRepository = getRepository(Models.School)
      //Check if school exist
      let school = await schoolRepository.findOne({ name: schoolName })
      //If school doesnt exist create new entity and save into DataBase
      if (!school) {
        console.log('Creating School')
        const schoolData = { name: schoolName, location: schoolLocation, schoolType: schoolType }
        const schoolEntity = await schoolRepository.create(schoolData)
        school = await schoolRepository.save(schoolEntity)
      }
      //get Repos
      const userRepository = getRepository(Models.User)
      const profileRepository = getRepository(Models.Profile)
      //Check if email exists in profile table in DataBase (Check 2)
      const doesEmaiExist = await profileRepository.findOne({ email })
      //If does exist throw error
      if (doesEmaiExist) throw new createError.Conflict(`${email} is already been registered`)
      //Create Profile
      const userProfile = await profileRepository.create({ lastName, firstName, email, school, accType: 1 })
      const profile = await profileRepository.save(userProfile)
      //Create User
      const password = generator.generate({ length: 10, numbers: true, symbols: true })
      const user = await userRepository.create({ userName, password, profile })
      //Save user to DataBase
      const savedUser = await userRepository.save(user)
      console.log(user)
      //Gen random string and and save to redis ref userName
      const randomString = await AuthServices.VeryifyEmial.CreateUserHash(savedUser.id)
      const accInfo: AccountInfo = { randomString, email, firstName, userName, password, userId: savedUser.id }
      //Send Email
      await Gmail.VerifyEMail(accInfo)
      //Send OK status to client
      res.sendStatus(200)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  SingUp: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      //Validate request (Check 1)
      const { accounts, accType, schoolId }: SingUpSchema = await AuthValidation.SingUpSchema.validateAsync(req.body)
      // Get User Repository
      const userRepository = getRepository(Models.User)
      // let number = 1
      // let userName: string = firstName + lastName + number
      // let doesUserNameExist = await userRepository.findOne({ userName })
      // while (doesUserNameExist) {
      //   number++
      //   userName = firstName + lastName + number
      //   doesUserNameExist = await userRepository.findOne({ userName })
      // }
      for (let index = 0; index < accounts.length; index++) {}

      //Send OK status to client
      res.sendStatus(200)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  verifyEmail: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { userId, randomString }: VerifyEmailSchema = await AuthValidation.VerifyEmailSchema.validateAsync(req.params)
      await AuthServices.VeryifyEmial.CheckUserHash(userId, randomString)
      //do after hashmatch
      const userRepository = getRepository(Models.User)
      const user = await userRepository.findOne({ id: userId })
      if (!user) throw new createError.NotFound('User not registered')
      user.isActive = true
      await user.updateUpdatedOn()
      await userRepository.save(user)
      res.sendStatus(200)
      res.sendFile('verifyEmail.html', { root: 'src/views' })
    } catch (error) {
      next(error)
    }
  },
  forgotPassword: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { email, userName }: ForgotPasswordSchema = await AuthValidation.ForgotPasswordSchema.validateAsync(req.body)
      const userRepository = getRepository(Models.User)
      const User = await userRepository.findOne({ userName }, { relations: ['profile'] })
      if (!User) throw new createError.Conflict(`${email} or ${userName} has not been registered`)
      const randomString = await AuthServices.ChangePassword.CreateUserHash(User.id)
      const accInfo: ForgotPasswordAccountInfo = { randomString, email, firstName: User.profile.firstName, userId: User.id }
      await Gmail.ChangePassword(accInfo)
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  },
  changePassword: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { password, userId, randomString }: ChangePasswordSchema = await AuthValidation.ChangePasswordSchema.validateAsync(req.body)
      const userRepository = getRepository(Models.User)
      const user = await userRepository.findOne({ id: userId })
      //If user does not exist throw error
      if (!user) throw new createError.NotFound('User not registered')
      const isMatch = await user.isValidPassword(password)
      if (isMatch) throw new createError.Conflict('Password is the same')
      await AuthServices.ChangePassword.CheckUserHash(userId, randomString)
      //do after hashmatch
      user.password = password
      await user.changePassword()
      await userRepository.save(user)
      res.sendStatus(200)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },
  login: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      //Validate Request (Check 1)
      await AuthValidation.LoginSchema.validateAsync(req.body)
      //Get email & password from request body
      const { userName, password } = req.body
      //Check if user exists in DataBase (Check 2)
      const userRepository = getRepository(Models.User)
      const user = await userRepository.findOne({ userName }, { relations: ['profile'] })
      //If user does not exist throw error
      if (!user) throw new createError.NotFound('User not registered')
      //Check if password matches (Check 3)
      const isMatch = await user.isValidPassword(password)
      //If password does not match throw error
      if (!isMatch) throw new createError.Unauthorized('Username/password not valid')
      //Sign AccessToken & RefreshToken
      const payload = {
        userId: user.id,
        userName,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.profile.email,
        school: user.profile.school,
        accType: user.profile.accType as any
      }
      const accessToken = await AuthServices.JWT.signAccessToken(payload)
      const refreshToken = await AuthServices.JWT.signRefreshToken(payload)
      //Send AccessToken & RefreshToken in httpOnly cookie
      res.cookie('accessToken', accessToken, { httpOnly: true })
      res.cookie('refreshToken', refreshToken, { httpOnly: true })
      res.json({ accessToken, refreshToken })
    } catch (error) {
      if (error.isJoi === true) return next(new createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },
  onClientLoad: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { accessToken, refreshToken } = req.cookies
      if (!refreshToken) throw new createError.Unauthorized()
      const accessPayload = await AuthServices.JWT.verifyAccessToken(accessToken)
      if (accessPayload) {
        const accessToken = await AuthServices.JWT.signAccessToken(accessPayload)
        res.cookie('accessToken', accessToken, { httpOnly: true })
        res.json({ accessToken: accessToken })
      }
      const refreshPayload = await AuthServices.JWT.verifyRefreshToken(refreshToken)
      if (refreshPayload) {
        const accToken = await AuthServices.JWT.signAccessToken(refreshPayload)
        const refToken = await AuthServices.JWT.signRefreshToken(refreshPayload)
        res.cookie('accessToken', accToken, { httpOnly: true })
        res.cookie('refreshToken', refToken, { httpOnly: true })
        res.json({ accessToken: accessToken, refreshToken: refToken })
      }
    } catch (error) {
      next(error)
    }
  },
  logout: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { refreshToken } = req.cookies
      if (!refreshToken) throw new createError.BadRequest()
      const payload = await AuthServices.JWT.verifyRefreshToken(refreshToken)
      Redis.DEL(payload.userId.toString(), (err, val) => {
        if (err) {
          console.log(err.message)
          throw new createError.InternalServerError()
        }
        console.log(val)
        res.sendStatus(200)
      })
    } catch (error) {
      next(error)
    }
  }
}
