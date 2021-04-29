const { MongoClient } = require('mongodb');

export default async function handler(req, res) {
    let iReserve = [];
    const client = new MongoClient(process.env.MONGO_CONNECTION, { useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db(process.env.MONGO_DB);
        const collection = database.collection(process.env.MONGO_COLLECTION)
        iReserve = await collection.find().toArray()
        console.log('/api/i-reserve.handler() iReserve: ', iReserve)
        if (req.method === 'POST') {
            if (req.body.action === 'unreserve') {
                if (req.body.items[req.body.items.length - 1].includes('davistech.instructure.com')) {
                    await collection.deleteOne({ _id: req.body.items.pop()})
                    if (req.body.items.length > 0) fetch('/api/i-reserve', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'unreserve',
                            items: req.body.items
                        })
                    })
                }
            } else if (req.body.action === 'reserve') {
                if (req.body._id.includes('davistech.instructure.com')) {
                    await collection.insertOne({
                        _id: req.body._id,
                        grader: req.body.grader,
                        reserved_at: req.body.reserved_at
                    })
                }
            }
        }
        
    } catch (e) {
        console.log('/api/i-reserve.handler() exception: ', e)
        // TODO: if post send error status
    } finally {
        await client.close();
        if (req.method === 'GET') res.status(200).json(JSON.stringify({ iReserve }))
        if (req.method === 'POST') res.status(200).send()
    }
}