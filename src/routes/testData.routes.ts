import express from 'express'
import Gmail from '../auth/gmail'

export const TestDataRoutes = express.Router()

TestDataRoutes.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send([1, 2, 3, 4, 5])
})
TestDataRoutes.post('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {})
TestDataRoutes.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send(`Data created ${req.body.data}`)
})

TestDataRoutes.patch('/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send('User updated')
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
