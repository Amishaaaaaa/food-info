const jwt = require("jsonwebtoken");
const jwtPassword = "thisismypass";
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://amishamishra12886:lWllpdczzsOA7oJj@cluster0.bv6fqzo.mongodb.net/food_info_user_auth?retryWrites=true&w=majority");

const User = mongoose.model('users', { username: String, email: String, password: String, name: String}); 

async function userExists(username, password) {
    try {
        const userExistsFlag = await User.exists({ username: username, password: password });
        return userExistsFlag;
    } catch (err) {
        res.status(403).json({
            msg: "invalid token"
        });
    }
}

function generateToken(username) {
    return jwt.sign({ username }, jwtPassword);
}

function verifyToken(token) {
    try {
        return jwt.verify(token, jwtPassword);
    } catch (err) {
        throw new Error("invalid token");
    }
}

async function authenticateUser(req, res, next) {
    const token = req.headers.authorization;
    try {
        const decoded = verifyToken(token);
        const username = decoded.username;

        const authorizedUser = await User.findOne({username: username});

        req.authorizedUser = authorizedUser;

        next();
    } catch (err) {
        res.status(403).json({
            msg: "invalid token"
        });
    }
}

module.exports = {
    User,
    userExists,
    generateToken,
    verifyToken,
    authenticateUser,
};



// const ALL_USERS = [{
//     username: "amisham",
//     email: "amisham@gmail.com",
//     password: "123",
//     name: "amisha mishra",
//   },
//   {
//     username: "mahima",
//     email: "mahima@gmail.com",
//     password: "123321",
//     name: "mahima tripathi",
//   },
//   {
//     username: "harsh26",
//     email: "harsh26@gmail.com",
//     password: "123324",
//     name: "harsh singh",
//   }];

//     User.create(ALL_USERS)
//     .then(result => {
//         console.log("Users saved successfully:", result);
//     })
//     .catch(err => {
//         console.error(err);
//     })