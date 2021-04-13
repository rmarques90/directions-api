const express = require('express');
const router = express.Router();

const {getAdminByLoginAndPassword} = require('../Mongo/admin');

router.post('/login', async (req, res) => {
    if (!req.body.login || !req.body.password) {
        res.status(400).json({message: 'Login or password are invalid'});
        return;
    }
    try {
        let admin = await getAdminByLoginAndPassword(req.body.login, req.body.password);

        if (admin) {
            delete admin.password;
            res.json({message: 'logged in', data: admin});
        } else {
            res.status(403).json({message: 'failed to login. Data is incorret'});
        }
    } catch (e) {
        console.error('Error getting admin with login/password', e);
        res.sendStatus(500);
    }
})

module.exports = router;