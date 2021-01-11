interface AccountInfo {
	userName: string
	password: string
	email: string
	userId: number
	firstName: string
	randomString: string
}
interface ForgotPasswordAccountInfo {
	email: string
	userId: number
	firstName: string
	randomString: string
}
interface ParentAccountInfo {
	email: string
	userId: number
	firstName: string
	randomString: string
}
interface ApplyAccountInfo {
	email: string
	firstName: string
	lastName: string
}
