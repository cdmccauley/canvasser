const { MongoClient } = require("mongodb");
let reserved = {}

// FIX: if reservations happen quickly then 2nd to click gets self-reserved, 1st gets other-reserved
// then if 2nd unreserves, 1st shows self-reserved

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (req.body.url.includes('davistech.instructure')) {
            // init array for calling to canvas for actual assignment ids
            let fetchCalls = []
            // create mongo client
            const client = new MongoClient(process.env.MONGO_CONNECTION, { useUnifiedTopology: true });
            try {
                // reset external reservations
                // TEST: if multiple people are calling this endpoint at the same time can they interfere by resetting reserved[]?
                reserved['external'] = []
                // connect to mongo
                await client.connect();
                // get db
                const database = client.db(process.env.MONGO_DB);
                // get collection
                const collection = database.collection(process.env.MONGO_COLLECTION)
                // get external reservations
                await collection.find().toArray()
                .then((arr) => arr.forEach((item) => {
                    console.log('reserve.js: ', item)
                    /* 
                    convert each external reservation _id to api endpoint and save for fetching
                    NOTES:
                    if another property is added to the document canvas assistant will crash
                    api/ca-reserve.js uses * to indicate that grader is using canvasser
                    if a user is using canvasser they don't need to be added to external
                    TODO:
                    contribute to canvas assistant to remove this flaw
                    */
                    if (item.grader[0] != '*') {
                        // get course id, assignment id, and student id
                        let ids = item._id.match(/\d{1,}/g)
                        // store api endpoint
                        fetchCalls.push(`${req.body.url}/api/v1/courses/${ids[0]}/assignments/${ids[1]}/submissions/${ids[2]}?access_token=${req.body.key}`)
                    }
                }))
                // call to canvas to get actual assignment id of each external reservation
                await Promise.all(fetchCalls.map((url) => {
                        return new Promise((resolve, reject) => {
                            resolve(fetch(url))
                        })
                        .then((res) => {
                            // console.log('reserved res: ', res)
                            return res.json()
                        })
                        .then((data) => {
                            // console.log('reserved data: ', data)
                            if (data.errors == undefined) {
                                reserved['external'].push(data.id.toString())
                            }
                        }) // cannot read prop toString
                    })
                )
            } catch (e) {
                console.log('reserve exception: ', e)
            } finally {
                // close mongo client
                await client.close();
            }
        }
        // canvasser only reserve
        let userId = req.body.userId.toString() // user id is stored as number in index and needs conversion
        let userReserved = req.body.userReserved
        if (Object.keys(reserved).length > 0) { // if there are current reserved
            // console.log(reserved)
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
        // set user reservations that were able to be reserved
        reserved[req.body.userId] = userReserved
    }
    // send back all reservations
    res.status(200).json(JSON.stringify({
        reserved
    }))
}