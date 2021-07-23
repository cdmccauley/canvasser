// const { MongoClient } = require('mongodb');
import { connectToDatabase } from "../../libs/mongodb";

export default async function handler(req, res) {
    let iReserve = [];
    // const client = new MongoClient(process.env.MONGO_CONNECTION, { useUnifiedTopology: true });
    const { database } = await connectToDatabase();
    let excepted = false;
    try {
        // await client.connect();
        // const database = client.db(process.env.MONGO_DB);
        const collection = await database.collection(process.env.MONGO_COLLECTION)
        iReserve = await collection.find().toArray()
        // iReserve = await database.collection(process.env.MONGO_COLLECTION).find().toArray()
        // console.log('/api/i-reserve.handler() iReserve:', iReserve)
        if (req.method === 'POST') {
            if (req.body.action === 'unreserve') {
                // console.log('/api/i-reserve.handler() unreserving:', req.body.items[req.body.items.length - 1])
                if (req.body.items[req.body.items.length - 1].includes(process.env.I_KEY)) {
                    await collection.deleteOne({ _id: req.body.items.pop()})
                    if (req.body.items.length > 0) fetch('https://canvasser.vercel.app/api/i-reserve', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'unreserve',
                            items: req.body.items
                        })
                    })
                    .catch((err) => console.log('i-reserve error:', err))
                }
            } else if (req.body.action === 'reserve') {
                // console.log('/api/i-reserve.handler() reserving:', req.body._id)
                if (req.body._id.includes(process.env.I_KEY)) {
                    await collection.insertOne({
                        _id: req.body._id,
                        grader: req.body.grader,
                        reserved_at: req.body.reserved_at
                    })
                }
            }
        }
    } catch (e) {
        excepted = true;
        console.log('/api/i-reserve.handler() exception: ', e)
    } finally {
        // await client.close();
        if (excepted) res.status(504).send()
        if (req.method === 'GET') res.status(200).json(JSON.stringify({ iReserve }))
        if (req.method === 'POST') res.status(200).send()
    }
}