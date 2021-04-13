const MongoClient = require('mongodb').MongoClient;
const {MONGO_FULL_URL, MONGO_COLLECTIONS, MONGO_COLLECTIONS_UNIQUE_VALUES} = require('../Utils/constants');
const {generateAdminToken} = require('../JWT');

const mongoUriConnString = `mongodb://${MONGO_FULL_URL}`;

let db;

const connectToMongoDb = async () => {
    try {
        //start conn with mongodb
       const conn = await MongoClient.connect(mongoUriConnString);
       db = conn.db('routes');

       //create indexes unique for collections
        _createUniqueIndexes();

        await _validateAndCreateFirstAdmin();
    } catch (e) {
        console.error('Error connecting on mongoDB', e);
        throw e;
    }
}

const getDB = () => {
    return db;
}

const _createUniqueIndexes = () => {
    Object.entries(MONGO_COLLECTIONS).forEach(async ([key, value]) => {
        getDB().collection(value).createIndex({[MONGO_COLLECTIONS_UNIQUE_VALUES[key]]: 1}, {unique: true});
    })
}

const _validateAndCreateFirstAdmin = async () => {
    const r = await getDB().collection(MONGO_COLLECTIONS.ADMIN).find({}).toArray();
    if (!r || !r.length) {
        let adminObj = {
            name: 'Admin',
            login: 'admin@admin.com',
        }
        adminObj.token = generateAdminToken(adminObj);

        adminObj.password = '123456';

        await getDB().collection(MONGO_COLLECTIONS.ADMIN).insertOne(adminObj);
    }
}

module.exports = {
    connectToMongoDb, getDB
};