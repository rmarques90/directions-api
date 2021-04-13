const express = require('express');
const router = express.Router();

const {validateUserToken, getUserTokenData} = require('../JWT');
const {getUserById, updateUserUsage} = require('../Mongo/user');
const {getDirectionsByAddressString} = require('../Directions');

router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).json({message: 'missing authorization token'});
        return;
    }
    let validUserToken = await validateUserToken(req.headers.authorization);
    if (validUserToken) {
        next();
        return;
    }
    res.status(403).json({message: 'Unauthorized'});
})

router.post('/get-directions', async (req, res) => {
    if (!req.body || !req.body.origin || !req.body.destination) {
        res.status(400).json({message: 'direction obj is invalid.'});
        return;
    }

    try {
        const userFromToken = await getUserTokenData(req.headers.authorization);

        if (!userFromToken || !userFromToken._id) {
            res.status(403).json({message: 'User not found by the provided token'});
            return;
        }

        const userFromDB = await getUserById(userFromToken._id);

        if (!userFromDB) {
            res.status(400).json({message: 'User not found. Check the provided token;'});
            return;
        }

        if (userFromDB.usage > userFromDB.quota) {
            res.status(403).message({message: 'User quota exceeded. Await for the renovation.'})
            return;
        }

        let routeObj = await getDirectionsByAddressString(req.body.origin, req.body.destination, userFromDB, req.body.waypoints, req.body.simplified);

        let newUsage = userFromDB.usage + 1;
        await updateUserUsage(userFromDB._id, newUsage);

        if (routeObj) {
            res.status(200).json({message: 'ok', data: routeObj});
        } else {
            res.status(204).json({message: 'address not found'});
        }
    } catch (e) {
        console.error('Error getting directions', e);
        res.sendStatus(500);
    }

})

module.exports = router;