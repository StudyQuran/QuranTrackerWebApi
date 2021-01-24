import express from 'express'
import Gmail from '../auth/gmail'
import { oAuth2Client } from '../config/Init/initGmail'

export const TestDataRoutes = express.Router()

TestDataRoutes.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send([1, 2, 3, 4, 5])
})
TestDataRoutes.post('/sendcokkie', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let accessToken = '123'
  let refToken = '456'
  res.cookie('accessToken', accessToken, { httpOnly: true })
  res.cookie('refreshToken', refToken, { httpOnly: true })
  res.json({ accessToken: accessToken, refreshToken: refToken })
})
TestDataRoutes.post('/recivecookie', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(req.cookies.accessToken, req.cookies.refreshToken)
})

TestDataRoutes.post('/sendemail', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const email = await Gmail.sendMail('mw3boy8thstrox@gmail.com')
  console.log(email)
  res.sendStatus(200)
})

TestDataRoutes.delete('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send('User deleted')
})

// "firstName": "thaha",
// "lastName": "shahzad",
// "userName": "asheftws",
// "email": "mw3boy8thstrox@gmail.com",
// "password": "Ilovebaba123!",
// "accType": "admin"
