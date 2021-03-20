let reserved = {}

export default function handler(req, res) {
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