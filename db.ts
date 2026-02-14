import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// PRODUCCIÓN (Vercel/Neon): Usa POSTGRES_URL
// LOCAL: Usa variables individuales
const pool = new Pool(
  process.env.POSTGRES_URL
    ? {
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432
      }
)

export default pool
