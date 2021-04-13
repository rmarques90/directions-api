const {getDB} = require('./index');

const _getCollection = () => {
    return getDB().collection('admin');
}

const getAdminByLoginAndPassword = async (login, password) => {
    if (!login || !password) {
        throw new Error('Login or password are invalid');
    }

    return await _getCollection().findOne({login: login, password: password});
}

const getAdminByLoginAndPasswordAndRefreshToken = async (login, password, refreshToken) => {
    if (!login || !password || !refreshToken) {
        throw new Error('Login or password or refresh token is invalid');
    }

    return await _getCollection().findOne({login: login, password: password, refreshToken: refreshToken});
}


module.exports = {
    getAdminByLoginAndPassword, getAdminByLoginAndPasswordAndRefreshToken
}