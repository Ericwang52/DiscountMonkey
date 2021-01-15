import React, { Component } from "react";
import { useParams } from "react-router-dom";
import {LoginContext} from "./LoginContext";
import Seller from "./Seller";
import LinesEllipsis from "react-lines-ellipsis";

class Item extends Component{
    constructor(props){

        super(props);

        this.state = {
            output:"",
            msg:<div class="spinner-border" role="status" style={{marginTop:"10%"}}>
            <span class="sr-only">Loading...</span>
          </div>,
            done:false,
            title:"",
            image:""
    }
  }
  componentDidMount(){
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' , "Authorization": this.context.token},

    }
    fetch("/api/item?upc="+this.props.match.params.upc, requestOptions).then(response=>response.json()).then((data)=>{
      if(data.items===undefined){
        this.setState({msg: "Sorry. Item not found."});
     //   this.props.history.push("/");
      }else{
        this.setState({done: true, title:data.items.title, image:data.items.images[0], output: data.items.pricing.map(sellerDetails => <Seller sellerDetails={sellerDetails}/>)})
      }
        
        
    }).catch(error=>{
        this.context.toggleLogout()
        this.props.history.push("/login");
    })
  }
  render(){
    return <div className="container-fluid">
        
    <div  className="row" style={{"padding":"30px"}} >
      <div className="results">

        {this.state.done? 
        <div class="col">
            <h1>
                Offers for {this.state.title}
            </h1>
          <img src={this.state.image} style={{"max-height":"300px", "width":"auto", "margin-top":"10px", "margin-bottom":"25px"}}></img>
        <div className= "card-columns">{this.state.output}</div>
        </div>
        :<p>{this.state.msg}</p>}
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
Item.contextType = LoginContext
export default Item;