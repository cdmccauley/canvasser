import { MongoClient } from 'mongodb'

const uri = process.env.PRIVATE_MONGO
const options = {}

let privateClient
let privateClientPromise

if (!process.env.PRIVATE_MONGO) {
  throw new Error('add PRIVATE_MONGO to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoPrivateClientPromise) {
    privateClient = new MongoClient(uri, options)
    global._mongoPrivateClientPromise = privateClient.connect()
  }
  privateClientPromise = global._mongoPrivateClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  privateClient = new MongoClient(uri, options)
  privateClientPromise = privateClient.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default privateClientPromise
