import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI is not defined. Add it to your .env.local file.'
  )
}

// In Next.js dev mode the module is re-evaluated on every HMR reload.
// We cache the connection on the global object to avoid opening a new
// connection on every hot reload.
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined
}

const cache: MongooseCache = global.__mongoose ?? { conn: null, promise: null }
global.__mongoose = cache

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn

  if (!cache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    cache.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('✓ MongoDB connected')
      return m
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (err) {
    cache.promise = null
    throw err
  }

  return cache.conn
}
