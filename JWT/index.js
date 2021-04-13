const jwt = require('jsonwebtoken');

const {JWT_ADMIN_SECRET, JWT_SYSTEM_SECRET, JWT_USER_SECRET} = require('../Utils/constants');

const generateSystemToken = (systemObj) => {
    if (!systemObj || !systemObj.name || !systemObj._id) {
        throw new Error('system is invalid');
    }
    if (systemObj.apiKey) {
        delete systemObj.apiKey
    }

    return jwt.sign(systemObj, JWT_SYSTEM_SECRET);
}

const validateSystemToken = async (jwtToken) => {
    try {
        await jwt.verify(jwtToken, JWT_SYSTEM_SECRET);
    } catch (e) {
        console.error('Error validating jwt token', e);
        return false;
    }
    return true;
}

const getSystemIdFromToken = async (jwtToken) => {
    try {
        const data = await jwt.verify(jwtToken, JWT_SYSTEM_SECRET);
        return data._id;
    } catch (e) {
        console.error('Error validating jwt token', e);
    }
}

const generateAdminToken = (admin) => {
    if (!admin || !admin.login) {
        throw new Error('admin is invalid');
    }
    if (admin.password) {
        delete admin.password;
    }
    return jwt.sign(admin, JWT_ADMIN_SECRET);
}

const validateAdminToken = async (jwtToken) => {
    try {
        await jwt.verify(jwtToken, JWT_ADMIN_SECRET);
    } catch (e) {
        console.error('Error validating jwt token', e);
        return false;
    }
    return true;
}

const generateUserToken = (user) => {
    if (!user || !user.email) {
        throw new Error('user is invalid');
    }

    return jwt.sign(user, JWT_USER_SECRET);
}

const validateUserToken = async (jwtToken) => {
    try {
        await jwt.verify(jwtToken, JWT_USER_SECRET);
    } catch (e) {
        console.error('Error validating jwt token', e);
        return false;
    }
    return true;
}

const getUserTokenData = async (jwtToken) => {
    try {
        return await jwt.verify(jwtToken, JWT_USER_SECRET);
    } catch (e) {
        console.error('Error validating jwt token', e);
        return null;
    }
}

module.exports = {
    generateSystemToken, validateSystemToken, getSystemIdFromToken,
    generateAdminToken, validateAdminToken,
    generateUserToken, validateUserToken, getUserTokenData
}