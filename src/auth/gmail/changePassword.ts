import nodemailer from 'nodemailer'
import { oAuth2Client } from '../../config/Init/initGmail'
import Config from '../../config'

export async function ChangePassword({ email, randomString, userName }: AccountInfo) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const token = accessToken.token as string
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAUTH2',
                user: 'mw3boy8thstrox@gmail.com',
                clientId: Config.Env.Gmail.GOOGLECLIENTID,
                clientSecret: Config.Env.Gmail.GOOGLECLIENTSECRET,
                refreshToken: Config.Env.Gmail.GOOGLEOAUTHREFRESHTOKEN,
                accessToken: token
            }
        })

        const mailOptions = {
            from: 'mw3boy8thstrox@gmail.com',
            to: email,
            subject: 'Quran Tracker',
            text: '',
            html: `<body>
      <div>
      <div>
      Hi ${userName}, </div>
      <h1>Reset Password</h1>
      <div>
      Link will expire in 10 minutes
      Click the buton below to change your password.
      </div>
      </div>
      <button><a href='http://localhost:8100/auth/changepassword/${userName}/${randomString}' target='blank'>Reset your password<a/></button>
      </body>`
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}
