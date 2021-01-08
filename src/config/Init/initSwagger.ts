import swaggerJSDoc from 'swagger-jsdoc'
import Config from '..'

export const swaggerDocs = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'QuranTrackerSchool',
      version: '1.0.0',
      description: 'Quran Tracking system for quran schools/classes'
    },
    basePath: '/',
    host: `localhost:${Config.Env.server.PORT}`
  },
  apis: ['src/routes/*.routes.ts']
})
