interface AdminSingUpSchema {
    schoolName: string
    schoolCity: string
    schoolState: string
    schoolType: string
    firstName: string
    lastName: string
    email: string
    password: string
    accType: accType
}
interface SingUpSchema {
    firstName: string
    lastName: string
    email: string
    password: string
    schoolId: number
    accType: accType
    parentId: string
}
interface LoginSchema {
    userName: string
    password: string
}
interface VerifyEmailSchema {
    userName: string
    randomString: string
}
interface ChangePasswordSchema {
    userName: string
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
interface createUsersSchema {
    schoolId: number
    accounts: {}
}
export { AdminSingUpSchema, createUsersSchema, SingUpSchema, VerifyEmailSchema, ChangePasswordSchema, LoginSchema }
