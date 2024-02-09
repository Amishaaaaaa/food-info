const jwt = require("jsonwebtoken");
const jwtPassword = "thisismypass";

const ALL_USERS = [
    {
      username: "amisham@gmail.com",
      password: "123",
      name: "amisha mishra",
    },
    {
      username: "mahima@gmail.com",
      password: "123321",
      name: "mahima tripathi",
    },
    {
      username: "harsh26@gmail.com",
      password: "123324",
      name: "harsh singh",
    },
  ]; 


function userExists(username, password) {
    return ALL_USERS.some(user => user.username === username && user.password === password);
}

function generateToken(username) {
    return jwt.sign({ username }, "thisismypass");
}

function verifyToken(token) {
    try {
        return jwt.verify(token, jwtPassword);
    } catch (err) {
        throw new Error("invalid token");
    }
}

function authenticateUser(req, res, next) {
    const token = req.headers.authorization;
    try {
        const decoded = verifyToken(token);
        const username = decoded.username;

        const authorizedUser = ALL_USERS.some(user => user.username === username);

        req.authorizedUser = authorizedUser;

        next();
    } catch (err) {
        res.status(403).json({
            msg: "invalid token"
        });
    }
}

module.exports = {
    userExists,
    generateToken,
    verifyToken,
    authenticateUser,
};