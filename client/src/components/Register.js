import React, { Component } from "react";
import { Link } from "react-router-dom";
import {LoginContext} from "./LoginContext"

class Register extends Component {
  constructor() {
      super();
      this.state = {
        username: "",
        email: "",
        password: "",
        password2: "",
        errors: {}
      };

      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
  }
  
  componentDidMount(){
      this._isMounted = true;
  }
  componentWillUnmount() {
      this._isMounted = false;
  }
  // Form Change handler
  onChange(e){
      this.setState({ [e.target.id]: e.target.value });
  };

  // Create new user account from form/state data
  onSubmit(e){
      e.preventDefault();
      const newUser = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2
      }

      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
      }
      
      // Make request to backend to create account
      fetch('/api/register', requestOptions)
      .then(response => {
      const r = response.json()
          if(response.ok){
              this.props.history.push("/login");
          }
          return r
      })
      .then(data => {
          if(this._isMounted){
              this.setState({ errors: data })
          }
      })
  };

  render() {
    // Redirect if already logged in
    if(this.context.loggedIn){
      this.props.history.push("/search");
    }
      const { errors } = this.state;
      return (
        <div className="container-fluid poppin login" style={{marginTop:"50px",maxWidth:"750px",width:"100%"}}>
          <div className="row">
            <div className="col-sm-12">
              <div>
                <h4>
                  <b>Register</b>
                </h4>
                <p>
                  Have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label for="username">Username</label>
                  <input className="form-control loginfo"
                    onChange={this.onChange}
                    value={this.state.username}
                    error={errors.username}
                    id="username"
                    type="text"
                  />
                  
                  <small className="form-text text-danger">{errors.username}</small>
                </div>
                <div className="form-group">
                  <label for="email">Email</label>
                  <input className="form-control loginfo"
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                  />
                  <small className="form-text text-danger">{errors.email}</small>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input className="form-control loginfo"
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                  />
                  <small className="form-text text-danger">{errors.password}</small>
                </div>
                <div className="form-group">
                  <label for="password2">Confirm Password</label>
                  <input className="form-control loginfo"
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    id="password2"
                    type="password"
                  />
                  <small className="form-text text-danger">{errors.password2}</small>
                </div>
                <div className="" >
                  <button
                    style={{

                      width: "150px",
                      borderRadius: "3px",
                      marginTop: "1rem",
                      float:"left"
                    }}
                    type="submit"
                    className="btn btn-large btn-primary "
                  >
                    Sign up
                  </button>
                </div>
              </form>
              {this.state.errors !=null ? <p>{JSON.stringify(this.errors)}</p> : null}
              {this.state.data !=null ? <p>{JSON.stringify(this.state.data)}</p> : null}
            </div>
          </div>
          
        </div>
      );
    }
}

Register.contextType = LoginContext
export default Register;