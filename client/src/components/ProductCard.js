//fix price with no decimals
import React from "react";
import {LoginContext} from "./LoginContext"
import LinesEllipsis from "react-lines-ellipsis";
import StarRatingComponent from 'react-star-rating-component';
class ProductCard extends React.Component{
    constructor(props){
        super(props);

        var image=props.productDetails.product.images.primary_image;

        if(image===undefined){
            image=props.productDetails.product.images[0];
        }


     
        if(typeof image === 'object'){
            image=props.productDetails.product.images[0].link;
        }

    
    
        const title=props.productDetails.product.title
        const rating=props.productDetails.product.rating
        //for now give amazon link
        const href= "/item/"+ props.productDetails.product.upc
        var price =0;
        if(props.productDetails.offers===undefined){
            price= Number(props.productDetails.product.buybox_winner.price).toFixed(2);
        }else{
            price= Number(props.productDetails.offers.primary.price).toFixed(2)

        }
    
        const asin=props.productDetails.product.item_id;
        var onWatchlist=props.productDetails.onWatchlist;
       
        this.state={
            title, rating, href, price, image, asin, onWatchlist
        }
        this.addList=this.addList.bind(this);
        this.removeList=this.removeList.bind(this);
    }
    removeList(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "Authorization": this.context.token},
    
        }

        fetch("/api/"+this.state.asin+"/delete", requestOptions).then(response=>response.json()).then(data=>{

            this.setState({
                onWatchlist:false
            })
               // this.state.products.searchProductDetails.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>:<p>{this.state.msg}
    
        }).catch(error=>{

            this.context.toggleLogout()
            this.context.history.push("/login");
        })
    }
    addList(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , "Authorization": this.context.token},
    
        }

        fetch("/api/"+this.state.asin+"/add", requestOptions).then(response=>response.json()).then(data=>{
   
            this.setState({
                onWatchlist:true
            })
               // this.state.products.searchProductDetails.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>:<p>{this.state.msg}
    
        }).catch(error=>{
 
            this.context.toggleLogout()
            this.context.history.push("/login");
        })
    }
    render(){
            return(
            <div className="card" style={{display:"inline-block",zIndex:0, "margin-bottom":"20px"}}>
                <img className="card-img-top" src={this.state.image} alt="Product Pic" style= {{"margin-top":"10px", "width":"auto", "max-width":"200px", height:"200px"}}/>
                <div className="card-body">
                    <div style={{"text-overflow": "ellipsis", width:"100%", height:"60px" }}>
                    
                    <LinesEllipsis text={this.state.title} maxLine="2" ellipsis="..." />
                    </div>
                    
                    <p className="card-text" style={{textTransform: "capitalize"}}> {"$"+this.state.price}</p> 
                    {/* <p className="card-text" style={{textTransform: "capitalize"}}><b>Rating: </b> {this.state.rating}</p>  */}
                    {this.state.rating!==null && <StarRatingComponent name="rate2" editing={false} starCount={5} value={this.state.rating}/>}
                    
                    <br></br>
                    <a style= {{"margin-right":"10px"}}href={this.state.href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">View</a>
                    {this.state.onWatchlist ?  
                    <button className="btn btn-primary" onClick={this.removeList}>Remove from List</button>:
                    <button className="btn btn-primary" onClick={this.addList}>Add to List</button>}
                </div>
            </div>
            )}
}
ProductCard.contextType = LoginContext
export default ProductCard