// fix display, FIX LOADING

import fetch from "node-fetch";
import React, { Component } from "react";
import {LoginContext} from "./LoginContext";
import ProductCard from "./ProductCard.js"
class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
        query:"",
        products:{searchProductDetails:[]},
        msg:"",
        output:""
    }
    this.queryInput = React.createRef()
    this.searchQuery = this.searchQuery.bind(this)
    this.editQuery = this.editQuery.bind(this)

  }

  searchQuery(e){

    e.preventDefault()
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' , "Authorization": this.context.token},

    }
    this.setState({msg:<div className="spinner-border" role="status">
    <span className="sr-only">Loading...</span>
  </div>, products:{searchProductDetails:[]}})
  //  this.setState({msg:"Loading..."})
    fetch("/api/amazon/search?keywords="+this.state.query, requestOptions).then(response=>response.json()).then(data=>{
        console.log(data.searchProductDetails);
            this.setState({products:data, output: <div className="results">{data.searchProductDetails.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>})
           // this.state.products.searchProductDetails.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>:<p>{this.state.msg}

    }).catch(error=>{
        this.context.toggleLogout()
        this.props.history.push("/login");
    })
    this.queryInput.current.blur()
  }

  editQuery(e){
    this.setState({
      query:e.target.value
    })
  }
  render() {
    return (
      <div className="container-fluid">
        <div  className="row" style={{"padding":"30px"}} >
          <div className="results">
          <h1>
                Search for a product!
            </h1>

            <form className="searchform" noValidate onSubmit={this.searchQuery} style={{marginBottom:10}}>
                <input className="formtext" ref={this.queryInput} value={this.state.query} onChange={this.editQuery} type="text" placeholder="Search"/> 
                <button type="submit"><i className="fa fa-search"></i></button>
            </form>
            {this.state.products.searchProductDetails && this.state.products.searchProductDetails.length>0? 
            <div className="card-columns">{this.state.output}</div>:<p>{this.state.msg}</p>}
          </div>
        </div>
      </div>
    );
  }
}
Search.contextType = LoginContext
export default Search;