import { createConnection } from 'typeorm'

const TypeORMConnection = createConnection()
  .then(() => {
    console.log('TypeORM connected to MySql')
  })
  .catch((err) => console.log(err.message))

export default TypeORMConnection
