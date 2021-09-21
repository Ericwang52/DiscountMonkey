//do walmart, deal price,saleprice
var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt= require("bcryptjs");
const {auth, issueJWT, getToken}=require("./auth.js");
const jwt = require('jsonwebtoken');

const {walmartSearch, getAllPrices}=require("./walmart")

const fetch=require("node-fetch");
requestsSoFar=0;
const User=require("../models/user.js")
const validateSignup = require("./validation/register");
const validateLogin = require("./validation/login");
const getWItem=require("./walmart").getWItem

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
  
            res.status(200).json({msg:"gucci"});
        });
                     
    });

router.post("/:id/add", auth, 
    (req, res)=>{
    const id= req.params.id;
    const decoded= getToken(req);

    const userid= decoded.sub;

    const tosave= {item:id, specificItem:req.body.specific};

    User.findOne({_id:userid}, (err, user)=>{
        if(err){
   
            res.status(401).json({msg:"u screwed up"});
        }
        else if(user){
            user.watchlist.push(tosave);
            user.save(err => {
                if(err){
               
                    res.status(401).json({msg:"uscrewedup", error:err});
                }else{
             
                    res.status(200).json({msg:"done"});
                }
            });

        }else{
            res.status(401).json({msg:"u screwed up"});
        }
    });
} );

router.get('/', auth, (req, res) => {
   
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

 const { errors, isValid } = validateLogin(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
  User.findOne({ username: req.body.username }, (err, user) => {
    if (!user) {
       
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

router.get("/walmart/search", auth, (req, res)=>{
    const decoded= getToken(req);

    const userid= decoded.sub;
    walmartSearch(req.query.keywords).then(response=>response.json()).then(function(data){
        if(data.search_results===undefined){
            return res.status(404).json({msg:"Sorry. Product not found"})
        }
        User.findOne({_id:userid}, (err, user)=>{
            if(err){
                res.status(401).json({msg:"Database error"});
            }else if (user){
                for(i=0; i<user.watchlist.length;i++){
                    for(j=0;j<data.search_results.length; j++){
   
                           
          
                            if(data.search_results[j].product.item_id===user.watchlist[i].item){
                                data.search_results[j].onWatchlist=true;
                                break;
                            }else if (!data.search_results[j].onWatchlist)
                            {
                                data.search_results[j].onWatchlist=false;
                            }
                    }
                }

                requestsSoFar++;
                res.status(200).json(data);
            }
          });
    });
});

router.get("/walmart/watchlist", auth, (req, res)=>{
    const decoded= getToken(req);

    const userid= decoded.sub;
    User.findOne({_id:userid}, (err, user)=>{
        if(err){
            res.status(401).json({msg:"Database error"});
        }
        else if(user){
            const arr= user.watchlist;

            var promises= user.watchlist.map((data)=>{
                return getWItem(data.item).then((response)=>response.json()).then(x=>{
                    x.onWatchlist=true;
                
                    return x;
                });
            });
            Promise.all(promises).then((results)=>{
                res.status(200).json({results:results});
            });

        }else{
            res.status(401).json({msg:"Database error"});
        }
    });
});
router.get("/item", auth, (req, res)=>{
    var arr=[req.query.upc]
    console.log("arr\n", arr)
    var promises= arr.map((data)=>{
            console.log("data\n", data)
                return getWItem(data).then((response)=>response.json()).then(x=>{
                    x.onWatchlist=true;
                    console.log("response\n", x)
                    return x;
                });
            });
            Promise.all(promises).then((results)=>{
                     console.log("results\n", results)
              getAllPrices(results.product.upc).then(response=>response.json()).then(data=>{
    console.log("data\n", data)
        requestsSoFar++;

        res.status(200).json(data);
    });
            });

    // getAllItem(req.params.id).then((data)=>{
    //     return data.json();
    // }).then((data)=>{
    //     res.status(200).json(data);
    // });
});
   
router.post("/refresh", (req, res) => {
    // Form validation

    jwt.verify(req.headers['authorization'].split(' ')[1], process.env.SECRET_KEY, (err,decoded) =>{
      if(err){
 
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
