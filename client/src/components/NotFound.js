import React, { Component } from "react";
import { Link } from "react-router-dom";
import {LoginContext} from "./LoginContext";

//Error 404 page
class PageNotFound extends Component {
  render() {
    return (
      <div className="container-fluid poppin"  style={{marginTop:"50px",maxWidth:"750px",width:"100%"}}>
        <div className="row">
          <div className="col-sm-12 text-center align-middle">
            ERROR 404: Page Not Found
            <div>
            <LoginContext.Consumer>
            {
              context => {
                return !context.loggedIn? (
                <Link to="/" onClick={context.toggleLogout} style={{borderRadius: "3px",}} className="btn btn-primary">
                <span>Return Home</span>
                </Link>
                ):
                (
                <Link to="/" onClick={context.toggleIn} style={{borderRadius: "3px",}} className="btn btn-primary">
                <span>Return to search</span>
                </Link>
                )
              }
            }
            </LoginContext.Consumer>
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

PageNotFound.contextType = LoginContext
export default PageNotFound;