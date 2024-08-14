import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async () => {
  if (cached.conn) {
    console.log('connected to existing database' + cached.conn)
    return cached.conn
  }

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env file',
    )
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: 'goevent',
      bufferCommands: false,
    })

  cached.conn = await cached.promise
  return cached.promise
}
