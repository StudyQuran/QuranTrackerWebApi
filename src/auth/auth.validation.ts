import Joi from 'joi'

const AdminApplySchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().lowercase().required(),
})
const AdminSingUpSchema = Joi.object({
	schoolName: Joi.string(),
	schoolLocation: Joi.string(),
	schoolType: Joi.string(),
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	email: Joi.string().email().lowercase().required(),
	accType: Joi.string().valid('admin').required(),
})

const SingUpSchema = Joi.object({
	accounts: Joi.object({ firstName: Joi.string().required(), lastName: Joi.string().required(), email: Joi.string().email().lowercase().required() }),
	schoolId: Joi.number().required(),
	accType: Joi.string().valid('admin', 'teacher', 'parent', 'student').required(),
})

const LoginSchema = Joi.object({
	userName: Joi.string().required(),
	password: Joi.string()
		.min(2)
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
		.required(),
})
const VerifyEmailSchema = Joi.object({
	userName: Joi.string().required(),
	randomString: Joi.string().required(),
})
const ForgotPasswordSchema = Joi.object({
	email: Joi.string().email().required(),
	userName: Joi.string().required(),
})
const ChangePasswordSchema = Joi.object({
	userId: Joi.number().required(),
	randomString: Joi.string().required(),
	password: Joi.string()
		.min(2)
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
		.required(),
})

const PasswordSchema = Joi.string()
	.min(2)
	.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
	.required()

export default {
	AdminSingUpSchema,
	AdminApplySchema,
	SingUpSchema,
	VerifyEmailSchema,
	ForgotPasswordSchema,
	ChangePasswordSchema,
	LoginSchema,
}
