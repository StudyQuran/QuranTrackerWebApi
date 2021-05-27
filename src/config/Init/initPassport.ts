import passport from 'passport'
import { Strategy } from 'passport-local'
import { getConnection } from 'typeorm'
import SqlModels from '../../models/sql'

passport.use(
    new Strategy(async (username, password, done) => {
        const MySql = getConnection('MySql')
        const userRepository = MySql.getRepository(SqlModels.User)
        const User = await userRepository.findOne({ userName: username })
        if (!User) return done(null, false)
        if (!User.isValidPassword(password)) return done(null, false)
        return done(null, User)
    })
)
