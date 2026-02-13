import mongoose from 'mongoose'

export const initDatabase = () => {
  const DATABASE_URL = process.env.DATABASE_URL

  mongoose.connection.on('open', () => {
    console.log('Successfully connected to database: ', DATABASE_URL)
  })
  return mongoose.connect(DATABASE_URL)
}
