const express = require('express');
const router = express.Router();

const {validateAdminToken} = require('../JWT');
const {updateSystemApiTokenByName, getSystems, insertNewSystem, getSystemById, getSystemByName} = require('../Mongo/system');

router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).json({message: 'missing authorization token'});
        return;
    }
    let validAdminToken = await validateAdminToken(req.headers.authorization);
    if (validAdminToken) {
        next();
        return;
    }
    res.status(403).json({message: 'Unauthorized'});
})

router.get('/list-systems', async (req, res) => {
    try {
        let systems = await getSystems();

        res.json({success: true, data: systems});
    } catch (e) {
        console.error('Error getting all systems', e);
        res.sendStatus(500);
    }
})

router.post('/add-system', async (req, res) => {
    if (!req.body || !req.body.name) {
        res.status(400).json({message: 'payload is invalid.'});
        return;
    }
    try {
        let addedId = await insertNewSystem({name: req.body.name, apiKey: req.body.apiKey});

        res.json({message: `system created!`, data: {_id: addedId}});
    } catch (e) {
        console.error('Error inserting a new system', e);
        res.sendStatus(500);
    }
})

router.get('/get-system-by-id/:id', async (req, res) => {
    if (!req.id) {
        res.status(400).json({message: 'id is invalid.'});
        return;
    }
    try {
        let systemObj = await getSystemById(req.id);

        if (systemObj) {
            res.json({message: `ok!`, data: systemObj});
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.error('Error getting system by id', e);
        res.sendStatus(500);
    }
})

router.get('/get-system-by-name/:name', async (req, res) => {
    if (!req.name) {
        res.status(400).json({message: 'name is invalid.'});
        return;
    }
    try {
        let systemObj = await getSystemByName(req.name);

        if (systemObj) {
            res.json({message: `ok!`, data: systemObj});
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.error('Error getting system by name', e);
        res.sendStatus(500);
    }
})

router.put('/update-system-api-token', async (req, res) => {
    if (!req.body || !req.body.apiKey || !req.body.systemName) {
        res.status(400).json({message: 'payload is invalid. Missing apiKey'});
        return;
    }

    try {
        const updated = await updateSystemApiTokenByName(req.body.systemName, req.body.apiKey);

        res.json({message: `updated? ${updated}`});
    } catch (e) {
        console.error('Error updating system token', e)
        res.sendStatus(500);
    }
})

router.put('/update-user-quota/:userId', async (req, res) => {

})

module.exports = router;