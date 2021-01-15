import React, { Component } from "react";
import { Link } from "react-router-dom";
import {LoginContext} from "./LoginContext";
import landing from "./landing2.png"

// Landing/homepage
class Landing extends Component {
  render() {
    //Redirect if logged in
    if(this.context.loggedIn){

      this.props.history.push("/search");
    }
    return (
      <div className="container-fluid poppin" >
        <div className="row align-items-center" style={{textAlign:"center",verticalAlign: "middle"}}>
            <div className="col-md-5 homebox" style={{textAlign:"Left",padding:"10vh 5vw 0px 5vw"}}>
              <h1 style={{fontSize:45,fontWeight:500}}>Discount Monkey.</h1>
              <br></br>
              <p>Discount Monkey is a shopping tool that helps you compare prices across many retailers. You can also save products to check for discounts in the future. 
                <br/>
                <br/>
                Start saving money and time on shopping today.
              </p>
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  marginRight:40,
                  marginBottom:20
                }}
                className="btn btn-raised btn-primary"
              >
                Start Saving
              </Link>
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  marginBottom:20
                }}
                className="btn btn-raised btn-secondary"
              >
                Log In
              </Link>
            </div>
            <div className="col-md-7">
              <img src={landing} alt="mockup" style={
                {marginLeft: "auto",
                marginRight: "auto",
                padding:"5vh 5vw 5vh 0px",
                width: "100%",
                }}/>
            </div>
          </div>
        </div>
    );
  }
}

Landing.contextType = LoginContext
export default Landing;