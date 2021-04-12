const { MongoClient } = require("mongodb");

// duplicate key error when a second person reserves

export default async function handler(req, res) {
    if (req.body._id.includes('davistech.instructure') || Array.isArray(req.body._id)) {
        const client = new MongoClient(process.env.MONGO_CONNECTION, { useUnifiedTopology: true });
        try {
            await client.connect();
            const database = client.db(process.env.MONGO_DB);
            const collection = database.collection(process.env.MONGO_COLLECTION)
            if (req.body.type == 'reserve') {
                // NOTE: ensure object only has _id, grader, and reserved_at props
                await collection.insertOne({
                    _id: req.body._id,
                    grader: `*${req.body.user}`, // using * as a flag to indicate grader is using canvasser
                    reserved_at: new Date().toLocaleString().replace(',', ''),
                })
            } else if (req.body.type == 'unreserve') {
                // TEST: canvasser may be able to unreserve ca reservations
                await collection.deleteOne({
                    _id: req.body._id
                })
            } else if (req.body.type == 'clean') {
                console.log('cleaning')
                await collection.find({grader: `*${req.body.user}`})
                .forEach(async (reservation) => {
                    console.log('cleaning reservation: ', reservation)
                    if (!req.body._id.includes(reservation._id)) {
                        console.log('deleteOne, user: ', reservation.grader, '_id: ', reservation._id)
                        await collection.deleteOne({
                            _id: reservation._id
                        })
                    }
                })
            }
        } catch (e) {
            console.log('ca-reserve.js exception: ', e)
        } finally {
            console.log('closing')
            await client.close();
        }
    }
    res.status(200).send()
}