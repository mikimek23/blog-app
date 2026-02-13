import dotenv from 'dotenv'
dotenv.config({ debug: true })
console.log(`env check`, process.env.PORT)
import app from './app.js'

import { initDatabase } from './utils/dbinit.js'
try {
  await initDatabase()
  const PORT = process.env.PORT
  app.listen(PORT || 5001, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
} catch (error) {
  console.log(error)
}
