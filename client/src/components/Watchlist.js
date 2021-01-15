
//empty watchlist
import fetch from "node-fetch";
import React, { Component } from "react";
import {LoginContext} from "./LoginContext";
import ProductCard from "./ProductCard.js"
class Watchlist extends Component{
    constructor(props){
        super(props);
        this.state = {
            output:"",
            msg:<div class="spinner-border" role="status" style={{marginTop:"5%"}}>
            <span class="sr-only">Loading...</span>
          </div>,
            done:false
    }
  }
  componentDidMount(){
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' , "Authorization": this.context.token},

    }
    fetch("/api/walmart/watchlist", requestOptions).then(response=>response.json()).then((data)=>{

            if(!data.results.length>0){
                console.log("nothing")
                this.setState({done:true, output:<p style={{"margin-top":"20px", "font-size":"20px"}}>You have nothing on your watchlist</p>})
            }
            else{
                this.setState({done: true, output: data.results.map(productDetails => <ProductCard productDetails={productDetails}/>)})
            }
           // this.state.products.searchProductDetails.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>:<p>{this.state.msg}
        
    }).catch(error=>{
        this.context.toggleLogout()
        this.props.history.push("/login");
    })
  }
  render(){
    return <div className="container-fluid">
        
    <div  className="row" style={{"padding":"30px"}} >
      <div className="results">
             <h1>
                Your Watchlist:
            </h1>
        {this.state.done? 
        <div className="card-columns">{this.state.output}</div>:<p>{this.state.msg}</p>}
      </div>
    </div>
  </div>
//     return <div className="container-fluid">
//     <div  className="row" >
//       <div className="col-md-8 overflow-auto recipeSection">
//         {this.state.output && this.state.output.length>0? 
//         <div className="card-columns recipeColumn">{this.state.output}</div>:<p>{this.state.msg}</p>}
//       </div>
//     </div>
//   </div>
      
  }
    
    
}
Watchlist.contextType = LoginContext
export default Watchlist;