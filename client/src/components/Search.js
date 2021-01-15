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
        products:{search_results:[]},
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
    this.setState({msg:<div className="spinner-border" role="status" style={{marginTop:"5%"}}>
    <span className="sr-only">Loading...</span>
  </div>, products:{search_results:[]}})
  //  this.setState({msg:"Loading..."})
    fetch("/api/walmart/search?keywords="+this.state.query, requestOptions).then(response=>response.json()).then(data=>{
        if(data.search_results===undefined){
          this.setState({msg:"Sorry. Product not Found"})
        }else{
          this.setState({products:data, output: <div className="results">{data.search_results.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>})
        }
            
           // this.state.products.searchProductDetails.map(productDetails => <ProductCard productDetails={productDetails}/>)}</div>:<p>{this.state.msg}

    }).catch(error=>{
      console.log(error)

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
            {this.state.products.search_results && this.state.products.search_results.length>0? 
            <div className="card-columns">{this.state.output}</div>:<p>{this.state.msg}</p>}
          </div>
        </div>
      </div>
    );
  }
}
Search.contextType = LoginContext
export default Search;