const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_CONNECTION, { useUnifiedTopology: true });
let reserved = {}

export default function handler(req, res) {
    // console.log(process.env.MONGO_CONNECTION)
    (async ()=> {
        try {
            // Connect the client to the server
            await client.connect();
            // Establish and verify connection
            const database = client.db(process.env.MONGO_DB);
            const collection = database.collection(process.env.MONGO_COLLECTION)
            console.log(collection);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    })().catch(console.dir);


    if (req.method === 'POST') {
        let userId = req.body.userId.toString() // user id is stored as number in index
        let userReserved = req.body.userReserved
        if (Object.keys(reserved).length > 0) { // if there are current reserved
            Object.keys(reserved).forEach((id) => { // for each user in reserved
                if (userId != id) { // make sure the user is not current user
                    userReserved.forEach((subId) => { // found another user, need to compare res ids
                        if (reserved[id].includes(subId)) {
                            // other user has already reserved the assignment
                            userReserved.splice(userReserved.indexOf(subId), 1)
                        }
                    })
                }
            })
        }
        reserved[req.body.userId] = userReserved
        res.status(200).json(JSON.stringify({
            reserved
        }))
    } else if (req.method == 'GET') {
        res.status(200).json(JSON.stringify({
            reserved
        }))
    }
}