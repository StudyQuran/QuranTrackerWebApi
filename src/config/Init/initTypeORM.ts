import { createConnections } from 'typeorm'

const TypeORMConnection = createConnections([
    {
        name: 'MySql',
        type: 'mysql',
        host: '107.180.24.242',
        port: 3306,
        username: 'ilm_db_user',
        password: 'ch,WA2Yhj5K_',
        database: 'ilm_lms_DB',
        //synchronize: true,
        logging: true,
        entities: ['src/models/sql/**/*.model.ts']
    },
    {
        name: 'MongoDb',
        type: 'mongodb',
        url: 'mongodb+srv://TS-Admind:ilovebaba123@polestartest.p85rh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        useUnifiedTopology: true,
        useNewUrlParser: true,
        synchronize: true,
        logging: true,
        entities: ['src/models/mongo/**/*.model.ts']
    }
])
    .then(() => {
        console.log('TypeORM connected to MySql')
    })
    .catch((err) => console.log(err.message))

export default TypeORMConnection
