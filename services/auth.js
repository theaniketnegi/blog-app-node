const JWT = require('jsonwebtoken');

const secret = 'asf214125fsa@@!!';

function createTokenForUser(user){
    return JWT.sign({
        _id: user._id,
        name: user.fullName,
        profileImageURL: user.profileImageURL,
        email: user.email,
        role: user.role,
    }, secret);
}

function validateToken(token){
    if(!token)
        return NULL;
    
    return JWT.verify(token, secret);
}

module.exports = {createTokenForUser, validateToken};