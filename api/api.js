//do walmart, deal price,saleprice
var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt= require("bcryptjs");
const {auth, issueJWT, getToken}=require("./auth.js");
const jwt = require('jsonwebtoken');
const getItem=require("./amazon").getItem
const getAllItem=require("./amazon").getAllItem
const fetch=require("node-fetch");
requestsSoFar=0;
const User=require("../models/user.js")
const validateSignup = require("./validation/register");
const validateLogin = require("./validation/login");

function repeatUser(username){
    User.findOne({username:username}, (err, user)=>{
        if(err){
            return err;
        }else if (user){
            return true;
        }else{
            return false;
        }
    });
}
router.use(function(req, res, next){
    if(requestsSoFar>100){
        router.close();
    }
    else{
        next();
    }
});
router.use("/register", (req, res, next)=>{
    const { errors, isValid } = validateSignup(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({username:req.body.username}, (err, user)=>{
        if(err){
            res.status(400).json({msg:"fuckedup"});
        }else if (user){
            res.status(400).json({username:"Username already exists"});
        }else{
            //need to check email here as well as if email is legit
            User.findOne({email:req.body.email}, (errr, userr)=>{
                if(errr){
                    return res.status(400).json({email:"Email already exists"});
                }else if (userr){
                    return res.status(400).json({email:"Email already exists"});
                }
                else{
                    next();
                }
            });
           // next();
        }
    });
});
router.post("/:id/delete", auth, 
    (req, res)=>{
        const userid= getToken(req).sub
        User.findOneAndUpdate({_id:userid}, {$pull:{watchlist:{item:req.params.id}}}, (err, data)=>{
            console.log(err, data);
            res.status(200).json({msg:"gucci"});
        });
                     
    });

router.post("/:id/add", auth, 
    (req, res)=>{
    const id= req.params.id;
    const decoded= getToken(req);
    console.log(decoded);
    const userid= decoded.sub;
    console.log(req.body.specific);
    const tosave= {item:id, specificItem:req.body.specific};
    console.log(userid);
    console.log(id);
    User.findOne({_id:userid}, (err, user)=>{
        if(err){
            console.log("nouser")
            res.status(401).json({msg:"u screwed up"});
        }
        else if(user){
            user.watchlist.push(tosave);
            user.save(err => {
                if(err){
                    console.log("badsave")
                    res.status(401).json({msg:"uscrewedup", error:err});
                }else{
                    console.log("done")
                    res.status(200).json({msg:"done"});
                }
            });

        }else{
            res.status(401).json({msg:"u screwed up"});
        }
    });
} );

router.get('/', auth, (req, res) => {
       // console.log(jwt.verify(getToken(req), "secretkey"));
  res.json({
    message: 'Welcome to the API'
  });
});
router.post("/register", (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // if err, do something
        if (err){
            return next(err);
        }
        const user= new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        }).save(err => {
            if(err){
                return next(err);
            }
        })
       // res.redirect("/api/login");
       res.status(200).json({msg:"success"});
      });
    });


router.post('/login', (req, res) => {
    console.log("log req")
 const { errors, isValid } = validateLogin(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user) {
        console.log("bad")
        return res.status(404).json({ usernamenotfound: "Username not found" });
    }
    bcrypt.compare(req.body.password, user.password, (err, ress) => {
        if (ress) {
          // passwords match! log user in
          const tokenObject= issueJWT(user);

          res.status(200).json({success:true, user:user, token:tokenObject.token, expiresIn:tokenObject.expiresIn})
        } else {
          // passwords do not match!
          return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
        }
      });

  });
});


router.get("/amazon/search", (req, res)=>{
    const decoded= getToken(req);
    console.log(decoded);
    const userid= decoded.sub;
    fetch('https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?domainCode=ca&keyword='+req.query.keywords+'&page=1&sortBy=relevanceblender', { 
    method: 'get', 
    headers: new fetch.Headers({
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": "axesso-axesso-amazon-data-service-v1.p.rapidapi.com",
        "useQueryString": true
    }), 

  }).then((response)=>response.json()).then(function(data){
      User.findOne({_id:userid}, (err, user)=>{
        if(err){
            res.status(401).json({msg:"u screwed up"});
        }else if (user){
            for(i=0; i<user.watchlist.length;i++){
                for(j=0;j<data.searchProductDetails.length; j++){
                        console.log(data.searchProductDetails[j].asin)
                        console.log(user.watchlist[i].item)
                        console.log(data.searchProductDetails[j].asin===user.watchlist[i].item);
                        console.log(!data.searchProductDetails[j].onWatchlist);
                        if(data.searchProductDetails[j].asin===user.watchlist[i].item){
                            data.searchProductDetails[j].onWatchlist=true;
                            break;
                        }else if (!data.searchProductDetails[j].onWatchlist)
                        {
                            data.searchProductDetails[j].onWatchlist=false;
                        }
                }
            }
            //console.log(data)
            requestsSoFar++;
            res.status(200).json(data);
        }
      });
     // console.log(data);

  });
});
router.get("/watchlist", auth, (req, res)=>{
    const decoded= getToken(req);
    console.log(decoded);
    const userid= decoded.sub;
    User.findOne({_id:userid}, (err, user)=>{
        if(err){
            res.status(401).json({msg:"u screwed up"});
        }
        else if(user){
            const arr= user.watchlist;

            var promises= user.watchlist.map((data)=>{
                return getItem(data.item).then((response)=>response.json()).then(x=>{
                    x.onWatchlist=true;
                    console.log(x)
                    return x;
                });
            });
            Promise.all(promises).then((results)=>{
                res.status(200).json({results:results});
            });

        }else{
            res.status(401).json({msg:"u screwed up"});
        }
    });
});

router.get("/item/:id", (req, res)=>{
    getAllItem(req.params.id).then((data)=>{
        return data.json();
    }).then((data)=>{
        res.status(200).json(data);
    });
});
router.post("/refresh", (req, res) => {
    // Form validation

    jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY, (err,decoded) =>{
      if(err){
        console.log(err)
        return res
          .status(400)
          .json({ error: "Invallid/Expired Token" });
      }
      else{
        const payload = {
          id: decoded.sub,
          iat:Date.now()
        };

        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          {
              expiresIn: 604800 // 1 Week in seconds
          },
          (err, token) => {
              if(err)
              {
                return res
                  .status(400)
                  .json({ error: err });
              }
              
              else{
              
                  return res.json({
                    success: true,
                    token: "Bearer "+ token
                  });
              }
              
          }
        );
        }
    })
});
module.exports=router;