interface AdminApplySchema {
  schoolName: string
  schoolLocation: string
  schoolType: string
  firstName: string
  lastName: string
  userName: string
  email: string
}
interface AdminSignUpSchema {
  schoolName: string
  schoolLocation: string
  schoolType: string
  firstName: string
  lastName: string
  userName: string
  email: string
}
interface SingUpSchema {
  accounts: []
  accType: accType
  schoolId: number
}
interface LoginSchema {
  accounts: []
  accType: accType
  schoolId: number
}
interface VerifyEmailSchema {
  userId: number
  randomString: string
}
interface ForgotPasswordSchema {
  email: string
  userName: string
}
interface ChangePasswordSchema {
  userId: number
  randomString: string
  password: string
}
enum accType {
  'superAdmin',
  'admin',
  'teacher',
  'parent',
  'student'
}
