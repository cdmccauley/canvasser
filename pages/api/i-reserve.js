const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
    let iReserve = [];
    const client = new MongoClient(process.env.MONGO_CONNECTION, { useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const collection = database.collection(process.env.MONGO_COLLECTION)
        iReserve = await collection.find().toArray()
    } catch (e) {
        console.log('/api/i-reserve.handler() exception: ', e)
    } finally {
        await client.close();
        // console.log('/api/i-reserve.handler() reserved: ', reserved)
    }
    res.status(200).json(JSON.stringify({
        iReserve
    }))
}
// process.env.MONGO_CONNECTION
// process.env.MONGO_DB
// process.env.MONGO_COLLECTION