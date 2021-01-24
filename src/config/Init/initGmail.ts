import { google } from 'googleapis'
import Config from '..'

const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
export const oAuth2Client = new google.auth.OAuth2(Config.Env.Gmail.GOOGLECLIENTID, Config.Env.Gmail.GOOGLECLIENTSECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: '1//049CGTyEEL2c5CgYIARAAGAQSNwF-L9IrFibKAnSUpdTSb-CweJKdukY56_uikbH3QfH0pL3vNroN7SyEkG_KWSY0IdnbhXc6glE' })
console.log('Google 0Auth2Client Connected')
