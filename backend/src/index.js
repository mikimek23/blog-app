import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { validateEnv, getEnv } = await import('./config/env.js')
const { initDatabase } = await import('./utils/dbinit.js')
const { default: app } = await import('./app.js')

try {
  validateEnv()
  await initDatabase()
  const env = getEnv()
  app.listen(env.port, () => {
    console.log(`Server is running on http://localhost:${env.port}`)
  })
} catch (error) {
  console.error(error)
  process.exit(1)
}
