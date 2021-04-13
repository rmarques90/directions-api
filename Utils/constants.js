require("dotenv").config();

const MONGO_FULL_URL = process.env.MONGO_URL || 'localhost:27017';

const MONGO_COLLECTIONS = {
    ADMIN: 'admin',
    SYSTEM: 'system',
    USER: 'user'
}

const MONGO_COLLECTIONS_UNIQUE_VALUES = {
    ADMIN: 'login',
    SYSTEM: 'name',
    USER: 'email'
}

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || 'darth-vader';
const JWT_SYSTEM_SECRET = process.env.JWT_SYSTEM_SECRET || 'death-star';
const JWT_USER_SECRET = process.env.JWT_USER_SECRET || 'luke-skywalker';

module.exports = {
    MONGO_FULL_URL, MONGO_COLLECTIONS, MONGO_COLLECTIONS_UNIQUE_VALUES,
    JWT_ADMIN_SECRET, JWT_SYSTEM_SECRET, JWT_USER_SECRET
}