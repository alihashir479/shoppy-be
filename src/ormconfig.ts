import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js'

dotenv.config()

export const dbConnectionConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.RDS_HOSTNAME || process.env.DB_HOST,
  port: +(process.env.RDS_PORT || process.env.DB_PORT || 5432),
  database: process.env.RDS_DB_NAME || process.env.DB_NAME,
  username: process.env.RDS_USERNAME || process.env.DB_USERNAME,
  password: process.env.RDS_PASSWORD || process.env.DB_PASSWORD,
  migrationsTableName: 'migrations',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false
}

export default new DataSource(dbConnectionConfig)