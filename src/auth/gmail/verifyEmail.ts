import nodemailer from 'nodemailer'
import { oAuth2Client } from '../../config/Init/initGmail'
import Config from '../../config'

export async function VerifyEMail({ email, randomString, firstName, userId }: AccountInfo) {
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
      Assalamualaikum ${firstName}, </div>
      <div>
      Please verify your email address
      </div>
      </div>
      <button><a href='http://localhost:5000/auth/verifyemail/${userId}/${randomString}' target='blank'>Verify Email<a/></button>
      </body>`
    }

    const result = await transport.sendMail(mailOptions)
    return result
  } catch (error) {
    return error
  }
}
