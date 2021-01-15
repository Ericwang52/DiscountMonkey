const passport = require("passport");
const JwtStrategy= require("passport-jwt").Strategy;
const ExtractJwt=require("passport-jwt").ExtractJwt;
const User=require("../models/user.js")
const jwt = require('jsonwebtoken');

require('dotenv').config();
const secretKey= process.env.SECRET_KEY
const options1= {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:secretKey,
}
const strategy= new JwtStrategy(options1, (payload, done)=> {

    User.findOne({_id: payload.sub}, (err, user)=>{
        if(err){
            return done(err, null);
        }
        if(user){

            return done(null, user);
        } else{
            return done(null, false);
        }
    });
});
passport.use(strategy);
function getToken(req){
    return jwt.verify(req.headers['authorization'].split(' ')[1], secretKey);
}
function issueJWT(user){
    const _id=user._id;
    const expiresIn='30d';
    const payload={
        sub:_id,
        iat:Date.now()
    }
    const signedToken=jwt.sign(payload, secretKey, {expiresIn:expiresIn});
    return {
        token: "Bearer " +signedToken,

        expires:expiresIn
    };
}

module.exports.auth= passport.authenticate("jwt", {session: false});
module.exports.getToken=getToken;
module.exports.issueJWT=issueJWT;