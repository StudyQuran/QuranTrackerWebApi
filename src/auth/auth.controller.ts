import express from 'express'
import createError from 'http-errors'
import Redis from '../config/Init/initRedis'
import Gmail from '../auth/gmail'
import AuthServices from './auth.service'
import { getRepository } from 'typeorm'
import AuthValidation from '../auth/auth.validation'
import SqlModels from '../models/sql'
import { AdminSingUpSchema } from './auth.models'

export default {
    adminSingUp: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            //Validate request (Check 1)
            const { schoolName, schoolCity, schoolState, schoolType, firstName, lastName, email, password, accType } =
                (await AuthValidation.AdminSingUpSchema.validateAsync(req.body)) as AdminSingUpSchema
            const schoolRepository = getRepository(SqlModels.School)
            //Check if school exist
            let school = await schoolRepository.findOne({ name: schoolName })
            const schoolData = { name: schoolName, city: schoolCity, state: schoolState, schoolType: schoolType }
            //If school doesnt exist create new entity and save into DataBase
            if (!school) {
                const schoolEntity = schoolRepository.create(schoolData)
                school = await schoolRepository.save(schoolEntity)
            }
            //Check if user exists in DataBase (Check 2)
            const userRepository = getRepository(SqlModels.User)
            const doesUserExist = await userRepository.findOne({ email })
            //If does not exist throw error
            if (doesUserExist) throw new createError.Conflict(`${email} is already been registered`)
            //Create UserName
            let twoToFourNumber = Math.floor(Math.random() * (4 - 2 + 1) + 2)
            let firstNameSub = firstName.substring(0, twoToFourNumber)
            let lastNameSub = lastName.substring(0, twoToFourNumber)
            let fourDigitnumber = Math.floor(1000 + Math.random() * 9000)
            let userName: string = firstNameSub + lastNameSub + fourDigitnumber
            let doesUserNameExist = await userRepository.findOne({ userName })
            while (doesUserNameExist) {
                fourDigitnumber++
                userName = firstNameSub + lastNameSub + fourDigitnumber
                doesUserNameExist = await userRepository.findOne({ userName })
            }
            // Create Profile
            const profileRepository = getRepository(SqlModels.Profile)
            const profileEntity = profileRepository.create({ lastName, firstName, school, accType })
            const profile = await profileRepository.save(profileEntity)
            // Create User
            const userEntity = userRepository.create({
                userName: userName.toLowerCase(),
                email,
                password,
                profile
            })
            //Save user to DataBase
            const user = await userRepository.save(userEntity)
            console.log(user)
            //Gen random string and and save to redis ref userName
            const randomString = await AuthServices.VeryifyEmial.CreateUserHash(userName)
            const accInfo: AccountInfo = { randomString, email, userName: userName }
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
            const { email, firstName, lastName, password, accType } = await AuthValidation.SingUpSchema.validateAsync(req.body)
            //Check if user exists in DataBase (Check 2)
            const userRepository = getRepository(SqlModels.User)
            const doesUserExist = await userRepository.findOne({ email })
            //If does not exist throw error
            if (doesUserExist) throw new createError.Conflict(`${email} is already been registered`)
            //Create new user
            let number = 1
            let userName: string = firstName + lastName + number
            let doesUserNameExist = await userRepository.findOne({ userName })
            while (doesUserNameExist) {
                number++
                userName = firstName + lastName + number
                doesUserNameExist = await userRepository.findOne({ userName })
            }
            const userData = {
                email,
                firstName,
                lastName,
                password,
                accType,
                userName: userName.toLowerCase()
            }
            const user = userRepository.create(userData)
            console.log(user)
            //Save user to DataBase
            const savedUser = await userRepository.createQueryBuilder().insert().into(SqlModels.User).values(user).execute()
            console.log(savedUser.identifiers)
            //Gen random string and and save to redis ref userName
            const randomString = await AuthServices.VeryifyEmial.CreateUserHash(firstName + lastName)
            const accInfo: AccountInfo = { randomString, email, userName: firstName + lastName }
            //Send Email
            await Gmail.VerifyEMail(accInfo)
            //Send OK status to client
            res.sendStatus(200)
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    verifyEmail: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { userName, randomString } = await AuthValidation.VerifyEmailSchema.validateAsync(req.params)
            await AuthServices.VeryifyEmial.CheckUserHash(userName, randomString)
            //do after hashmatch
            const userRepository = getRepository(SqlModels.User)
            const user = await userRepository.findOne({ userName })
            if (!user) throw new createError.NotFound('User not registered')
            user.isActive = true
            await user.updateUpdatedOn()
            await userRepository.save(user)
            res.sendFile('verifyEmailSuccess.html', { root: 'src/views' })
        } catch (error) {
            next(error)
        }
    },
    forgotPassword: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { email, userName } = req.body
            const userRepository = getRepository(SqlModels.User)
            const doesExist = await userRepository.findOne({ email, userName })
            if (!doesExist) throw new createError.Conflict(`${email} or ${userName} has not been registered`)
            const randomString = await AuthServices.ChangePassword.CreateUserHash(userName)
            const accInfo: AccountInfo = { randomString, email, userName }
            await Gmail.ChangePassword(accInfo)
            res.sendStatus(200)
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { password, userName, randomString } = await AuthValidation.ChangePasswordSchema.validateAsync(req.body)
            const userRepository = getRepository(SqlModels.User)
            const user = await userRepository.findOne({ userName })
            //If user does not exist throw error
            if (!user) throw new createError.NotFound('User not registered')
            const isMatch = await user.isValidPassword(password)
            if (isMatch) throw new createError.Conflict('Password is the same')
            await AuthServices.ChangePassword.CheckUserHash(userName, randomString)
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
            const userRepository = getRepository(SqlModels.User)
            const user = await userRepository.findOne({ userName })
            //If user does not exist throw error
            if (!user) throw new createError.NotFound('User not registered')
            //Check if password matches (Check 3)
            const isMatch = await user.isValidPassword(password)
            //If password does not match throw error
            if (!isMatch) throw new createError.Unauthorized('Username/password not valid')
            //Sign AccessToken & RefreshToken
            const accessToken = await AuthServices.JWT.signAccessToken(user.id)
            const refreshToken = await AuthServices.JWT.signRefreshToken(user.id)
            //Send AccessToken & RefreshToken in httpOnly cookie
            res.cookie('accessToken', accessToken, { httpOnly: true })
            res.cookie('refreshToken', refreshToken, { httpOnly: true })
            res.json({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) return next(new createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },
    refreshToken: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { refreshToken } = req.cookies
            if (!refreshToken) throw new createError.BadRequest()
            const userId = await AuthServices.JWT.verifyRefreshToken(refreshToken)

            const accessToken = await AuthServices.JWT.signAccessToken(userId)
            const refToken = await AuthServices.JWT.signRefreshToken(userId)

            res.cookie('accessToken', accessToken, { httpOnly: true })
            res.cookie('refreshToken', refToken, { httpOnly: true })
            res.json({ accessToken: accessToken, refreshToken: refToken })
        } catch (error) {
            next(error)
        }
    },
    logout: async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw new createError.BadRequest()
            const userId = await AuthServices.JWT.verifyRefreshToken(refreshToken)
            Redis.DEL(userId.toString(), (err, val) => {
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
