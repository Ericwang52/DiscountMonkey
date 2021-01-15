//fix price with no decimals
import React from "react";
import {LoginContext} from "./LoginContext"
import LinesEllipsis from "react-lines-ellipsis";

class Seller extends React.Component{
    constructor(props){
        super(props);
        console.log("a");
    
    
        const name=props.sellerDetails.seller
        //for now give amazon link
        const href= "https://"+props.sellerDetails.website_name
        const price =Number(props.sellerDetails.price).toFixed(2);
        const condition=props.sellerDetails.condition;
        this.state={
            name, href, price, condition
        }
    }
    render(){
            return(
            <div className="card" style={{display:"inline-block",zIndex:0, "margin-bottom":"20px"}}>
                <div className="card-body">
                    <div style={{"text-overflow": "ellipsis", width:"100%", height:"60px" }}>
                    
                    <LinesEllipsis text={this.state.name} maxLine="2" ellipsis="..." />
                    </div>
                    
                    <p className="card-text" style={{textTransform: "capitalize"}}> {"$"+this.state.price} <br>
                    
                    </br>
                    Condition: {this.state.condition} <br></br>
                    </p> 
                
                    <br></br>
                    <a style= {{"margin-right":"10px"}}href={this.state.href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">View</a>
                </div>
            </div>
            )}
}
Seller.contextType = LoginContext
export default Seller