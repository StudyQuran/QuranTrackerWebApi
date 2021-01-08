import { google } from 'googleapis'
import Config from '..'

const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
export const oAuth2Client = new google.auth.OAuth2(Config.Env.Gmail.GOOGLECLIENTID, Config.Env.Gmail.GOOGLECLIENTSECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: Config.Env.Gmail.GOOGLEOAUTHREFRESHTOKEN })
