const {getDB} = require('./index');

const _getCollection = () => {
    return getDB().collection('requested_routes_logs');
}

const insertNewLog = async (userId, systemId, routeObj, simplifiedObj) => {
    if (!userId || !systemId || !routeObj) {
        throw new Error('Objects are invalid')
    }

    let log = {
        userId: userId,
        systemId: systemId,
        routeObj: routeObj,
        simplifiedObj: simplifiedObj,
        date: new Date()
    }

    await _getCollection().insertOne(log);
}

module.exports = {
    insertNewLog
}
