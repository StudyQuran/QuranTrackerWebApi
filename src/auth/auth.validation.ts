import Joi from 'joi'
const PasswordSchema = Joi.string()
    .min(2)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()

const AdminSingUpSchema = Joi.object({
    schoolName: Joi.string(),
    schoolCity: Joi.string(),
    schoolState: Joi.string(),
    schoolType: Joi.string().valid('islamic', 'masjid', 'online', 'other'),
    firstName: Joi.string().lowercase().required(),
    lastName: Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: PasswordSchema,
    accType: Joi.string().valid('admin').required()
})

const SingUpSchema = Joi.object({
    firstName: Joi.string().lowercase().required(),
    lastName: Joi.string().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: PasswordSchema,
    schoolId: Joi.number(),
    accType: Joi.string().valid('admin', 'teacher', 'parent', 'student').required(),
    parentId: Joi.string()
})

const LoginSchema = Joi.object({
    userName: Joi.string().lowercase().required(),
    password: PasswordSchema
})
const VerifyEmailSchema = Joi.object({
    userName: Joi.string().lowercase().required(),
    randomString: Joi.string().required()
})
const ChangePasswordSchema = Joi.object({
    userName: Joi.string().lowercase().required(),
    randomString: Joi.string().required(),
    password: PasswordSchema
})

export default {
    AdminSingUpSchema,
    SingUpSchema,
    VerifyEmailSchema,
    ChangePasswordSchema,
    LoginSchema
}
