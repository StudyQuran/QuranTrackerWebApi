import { School } from '../models/school.model'

interface JwtPayload {
  userId: number
  userName: string
  firstName: string
  lastName: string
  email: string
  school: School
  accType: any
}
