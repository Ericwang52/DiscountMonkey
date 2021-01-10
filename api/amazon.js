const fetch=require("node-fetch");
module.exports.getItem=function (id){
    return new Promise((resolve, reject)=>{
     fetch("https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-lookup-product?url=https://www.amazon.ca/dp/"+id, { 
                    method: 'get', 
                    headers: new fetch.Headers({
                        "x-rapidapi-key": process.env.API_KEY,
                        "x-rapidapi-host": "axesso-axesso-amazon-data-service-v1.p.rapidapi.com",
                        "useQueryString": true
                    }), 
                  }).then(function(data){
                      data.onWatchlist=true;
                      requestsSoFar++;
                      if(requestsSoFar>100){
                          throw "too man requests";
                      }
                      console.log(requestsSoFar);
                      resolve(data)
                    });
    });
}
module.exports.getAllItem=function(id){
    return new Promise((resolve,reject)=>{
        fetch("https://api.apigenius.io/products/search?keyword=mouse")
    });
}