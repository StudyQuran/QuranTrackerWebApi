import * as dotenv from 'dotenv'
dotenv.config()

const SERVER_PORT = process.env.PORT || 5000

const REDIS_URI = process.env.REDIS_URI || ''
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
const TYPEORM_CONNECTION = process.env.TYPEORM_CONNECTION || ''
const TYPEORM_HOST = process.env.TYPEORM_HOST || ''
const TYPEORM_PORT = process.env.TYPEORM_PORT || ''
const TYPEORM_USERNAME = process.env.TYPEORM_USERNAME || ''
const TYPEORM_PASSWORD = process.env.TYPEORM_PASSWORD || ''
const TYPEORM_DATABASE = process.env.TYPEORM_DATABASE || ''
const TYPEORM_SYNCHRONIZE = process.env.TYPEORM_SYNCHRONIZE || ''
const TYPEORM_LOGGING = process.env.TYPEORM_LOGGING || ''
const COOKIE_SECRET = process.env.COOKIE_SECRET || ''
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ''
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''
const GOOGLEOAUTHACCESSTOKEN = process.env.GOOGLEOAUTHACCESSTOKEN || ''
const GOOGLEOAUTHREFRESHTOKEN = process.env.GOOGLEOAUTHREFRESHTOKEN || ''
const GOOGLECLIENTID = process.env.GOOGLECLIENTID || ''
const GOOGLECLIENTSECRET = process.env.GOOGLECLIENTSECRET || ''

export default {
    server: {
        PORT: SERVER_PORT
    },
    Gmail: {
        GOOGLEOAUTHACCESSTOKEN,
        GOOGLEOAUTHREFRESHTOKEN,
        GOOGLECLIENTID,
        GOOGLECLIENTSECRET
    },
    DataBase: {
        REDIS_URI,
        REDIS_PASSWORD,
        TYPEORM_CONNECTION,
        TYPEORM_HOST,
        TYPEORM_PORT,
        TYPEORM_USERNAME,
        TYPEORM_PASSWORD,
        TYPEORM_DATABASE,
        TYPEORM_SYNCHRONIZE,
        TYPEORM_LOGGING
    },
    session: {
        COOKIE_SECRET
    },
    JWT: {
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET
    }
}
