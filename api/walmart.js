const fetch=require("node-fetch");
require('dotenv').config();
module.exports.walmartSearch=function (term){
    return new Promise((resolve, reject)=>{
        console.log("https://api.bluecartapi.com/request?api_key="+process.env.WALMART_API_KEY+"&type=search&search_term="+term+"&sort_by=best_seller")
     fetch("https://api.bluecartapi.com/request?api_key="+process.env.WALMART_API_KEY+"&type=search&search_term="+term+"&sort_by=best_seller", { 
                    method: 'get', 
                  }).then(function(data){
                      requestsSoFar++;
                      if(requestsSoFar>100){
                          throw "too man requests";
                      }
                      console.log(requestsSoFar);
                      console.log(data)
                      resolve(data)
                    });
    });
}
module.exports.getAllPrices=function(upc){
    return new Promise((resolve, reject)=>{
        
     fetch("https://api.apigenius.io/products/lookup?upc="+upc+"&api_key="+process.env.PRODUCT_API_KEY, { 
                    method: 'get', 
                  }).then(function(data){
                      requestsSoFar++;
                      if(requestsSoFar>100){
                          throw "too man requests";
                      }
                      console.log(requestsSoFar);
                      resolve(data)
                    });
    });
}
module.exports.getWItem=function(id){
    return new Promise((resolve, reject)=>{
        fetch("https://api.bluecartapi.com/request?api_key="+process.env.WALMART_API_KEY+"&type=product&item_id="+id).then(function(data){
            requestsSoFar++;
            if(requestsSoFar>100){
                throw "too man requests";
            }
            console.log(requestsSoFar);
            data.onWatchlist=true;
            resolve(data)
          });
    });
}
