const ObjectId = require('mongodb').ObjectID;
const {getDB} = require('./index');
const {generateSystemToken} = require('../JWT');

const _getCollection = () => {
    return getDB().collection('system');
}

const getSystemById = async (id) => {
    if (!id) {
        throw new Error('id is invalid');
    }
    return await _getCollection().findOne({_id: new ObjectId(id)});
}

const getSystemByName = async (name) => {
    if (!name) {
        throw new Error('name is invalid');
    }
    return await _getCollection().findOne({name: name});
}

const insertNewSystem = async (systemObj) => {
    if (!systemObj || !systemObj.name) {
        throw new Error('System obj is invalid');
    }

    const resp = await _getCollection().insertOne(systemObj);

    let objInserted = resp.ops[0];

    let generatedToken = generateSystemToken(objInserted);

    await _getCollection().updateOne({_id: new ObjectId(objInserted._id)}, {$set: {token: generatedToken}});

    return resp.insertedId;
}

const updateSystemByName = async (systemObj) => {
    if (!systemObj || !systemObj.name) {
        throw new Error('System obj is invalid');
    }

    const r = await _getCollection().updateOne({_id: new ObjectId(systemObj._id)}, {$set: systemObj});

    return r.modifiedCount > 0;
}

const updateSystemApiTokenByName = async (systemName, apiKey) => {
    if (!systemName) {
        throw new Error('System name is invalid');
    }

    const r = await _getCollection().updateOne({name: systemName}, {$set: {apiKey: apiKey}});

    return r.modifiedCount > 0;
}

const getSystems = async () => {
    return await _getCollection().find({}).toArray();
}

module.exports = {
    getSystemByName, insertNewSystem, updateSystemByName, updateSystemApiTokenByName, getSystems, getSystemById
}