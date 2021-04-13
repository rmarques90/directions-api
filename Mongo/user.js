const ObjectId = require('mongodb').ObjectID;

const {getDB} = require('./index');

const {generateUserToken} = require('../JWT');

const _getCollection = () => {
    return getDB().collection('user');
}

const createUser = async (userObj) => {
    if (!userObj.name || !userObj.systemId) {
        throw new Error('userobj is invalid');
    }

    let resp = await _getCollection().insertOne(userObj);

    let insertedObj = resp.ops[0];

    try {
        let generatedToken = generateUserToken({name: userObj.name, email: userObj.email, systemId: userObj.systemId});

        await _getCollection().updateOne({_id: new ObjectId(insertedObj._id)}, {$set: {token: generatedToken}});

        return resp.insertedId;
    } catch (e) {
        throw e;
    }
}

const updateUserUsage = async (userId, usage) => {
    if (!userId || !usage) {
        throw new Error('userId is invalid');
    }

    await _getCollection().updateOne({_id: new ObjectId(userId)}, {$set: {usage: usage}});

    return true;
}

const getUserById = async (id) => {
    if (!id) {
        throw new Error('id is invalid');
    }
    return await _getCollection().findOne({_id: new ObjectId(id)});
}

const renewUserQuota = async (userObj) => {
    if (!userObj._id) {
        throw new Error('userobj is invalid');
    }

    let user = await _getCollection().findOne({_id: new ObjectId(user._id)});
    if (!user) {
        throw new Error('user not found');
    }

    try {
        await _getCollection().updateOne({_id: new ObjectId(user._id)}, {$set: {quota: 0}});

        return true;
    } catch (e) {
        console.error('error renewing user quota', e);
        throw e;
    }
}

const renewAllUserQuotaByDay = async (day) => {
    try {
        const r = await _getCollection().updateMany({renewDay: day}, {$set: {quota: 0}});

        return r.modifiedCount;
    } catch (e) {
        console.error('error renewing user quota', e);
        throw e;
    }
}

const deleteOneUser = async (userId) => {
    if (!userId) {
        throw new Error('User id is invalid');
    }

    try {
        const r = await _getCollection().deleteOne({_id: new ObjectId(userId)});

        return r.result && r.result.deletedCount > 0;
    } catch (e) {
        console.error('error renewing user quota', e);
        throw e;
    }
}

module.exports = {
    createUser, renewUserQuota, getUserById, updateUserUsage, renewAllUserQuotaByDay, deleteOneUser
}