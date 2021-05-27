import express from 'express'
import createError from 'http-errors'

interface ErrorWithStatus extends Error {
    status: number
    message: string
}
const Error404Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next(new createError.NotFound('This path does not exist'))
}
const ErrorHandlerMiddleware = (err: ErrorWithStatus, req: express.Request, res: express.Response, next: express.NextFunction) => {
    switch (err.message) {
        case 'verifyemail':
            res.sendFile('verifyEmailError.html', { root: 'src/auth/gmail/views' })
            break
        default:
            res.status(err.status || 500)
            res.send({
                error: {
                    status: err.status || 500,
                    message: err.message
                }
            })
            break
    }
}

export default {
    Error404: Error404Middleware,
    ErrorHandlder: ErrorHandlerMiddleware
}
