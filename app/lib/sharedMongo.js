import { MongoClient } from 'mongodb'

const uri = process.env.SHARED_MONGO
const options = {}

let sharedClient
let sharedClientPromise

if (!process.env.SHARED_MONGO) {
  throw new Error('add SHARED_MONGO to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoSharedClientPromise) {
    sharedClient = new MongoClient(uri, options)
    global._mongoSharedClientPromise = sharedClient.connect()
  }
  sharedClientPromise = global._mongoSharedClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  sharedClient = new MongoClient(uri, options)
  sharedClientPromise = sharedClient.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default sharedClientPromise
