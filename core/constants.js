const config = require("config");

const PORT = process.env.PORT || 5000;
const MONGO_URL = config.get("mongoUrl");
const SECRET_KEY = config.get("jwtSecret");

const STATUS = {
    INFO: 100,
    SUCCESSFUL: 200,
    CREATED: 201,
    REDIRECT: 300,
    CLIENT_ERROR: 400,
    SERVER_ERROR: 500
}

module.exports = {
    PORT,
    MONGO_URL,
    STATUS,
    SECRET_KEY
}