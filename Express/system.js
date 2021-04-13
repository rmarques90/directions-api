const express = require('express');
const router = express.Router();

const {validateSystemToken, getSystemIdFromToken} = require('../JWT');
const {createUser, deleteOneUser} = require('../Mongo/user');

router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).json({message: 'missing authorization token'});
        return;
    }
    let validSystemToken = await validateSystemToken(req.headers.authorization);
    if (validSystemToken) {
        next();
        return;
    }
    res.status(403).json({message: 'Unauthorized'});
})

router.post('/add-user', async (req, res) => {
    if (!req.body || !req.body.name || !req.body.email) {
        res.status(400).json({message: 'user obj is invalid.'});
        return;
    }
    try {
        let systemIdFromToken = await getSystemIdFromToken(req.headers.authorization);

        let renewDay = 10;
        if (req.body.renewDay && !isNaN(req.body.renewDay)) {
            renewDay = req.body.renewDay;
        }

        let userObj = {
            name: req.body.name,
            email: req.body.email,
            systemId: systemIdFromToken,
            usage: 0,
            quota: 100,
            renewDay: renewDay
        }
        let insertedId = await createUser(userObj);

        res.status(200).json({message: 'inserted!', data: {_id: insertedId}});
    } catch (e) {
        console.error('Error inserting new user', e);
        res.sendStatus(500);
    }
})

router.delete('/remove-user/:id', async (req, res) => {
    if (!req.id) {
        res.status(400).json({message: 'user id is invalid'});
        return;
    }

    try {
        let deleted = await deleteOneUser(req.id);

        res.status(200).json({message: 'delete user', data: {success: deleted}});
    } catch (e) {
        console.error('Error removing user', e);
        res.sendStatus(500);
    }
})

router.put('/update-user/:id', async (req, res) => {

})

module.exports = router;