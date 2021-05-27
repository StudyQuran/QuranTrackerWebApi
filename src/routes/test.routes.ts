import express from 'express'
import { getConnection } from 'typeorm'
import SqlModels from '../models/sql'
import Gmail from '../auth/gmail'

export const TestRoutes = express.Router()

TestRoutes.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send([1, 2, 3, 4, 5])
})
TestRoutes.get('/sqlget', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const MySql = getConnection('MySql')
        const userRepository = MySql.getRepository(SqlModels.User)
        const users = await userRepository.find()
        console.log(users)
        res.json(users)
    } catch (error) {
        next(error)
    }
})
TestRoutes.get('/mongoget', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // const MongoDb = getConnection('MongoDb')
        // const userRepository = MongoDb.getRepository()
        // const users = await userRepository.find()
        // console.log(users)
        // res.json(users)
    } catch (error) {
        next(error)
    }
})

// "firstName": "thaha",
// "lastName": "shahzad",
// "userName": "asheftws",
// "email": "mw3boy8thstrox@gmail.com",
// "password": "Ilovebaba123!",
// "accType": "admin"
