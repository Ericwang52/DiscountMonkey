import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import Home from './components/Home';
import {LoginContext} from "./components/LoginContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import Watchlist from "./components/Watchlist";
import Navbar from "./components/Navbar"
class App extends Component {
  constructor(props) {
    super(props);

    //Context methods to log in and out, saving/removing from localstorage
    this.toggleLogin = (token) => {
      localStorage.setItem("jwtToken", token);
      this.setState(state => ({
        loggedIn: true,
        token: token
      }));
    };

    this.toggleLogout = () => {
      localStorage.removeItem("jwtToken");
      this.setState(state => ({
        loggedIn: false,
        token: null
      }));
    };
    
    let t = localStorage.jwtToken;


   
    this.state = {
      loggedIn:localStorage.jwtToken ? true : false,
      toggleLogin: this.toggleLogin,
      toggleLogout: this.toggleLogout,
      token: t
    }  
  }
  componentDidMount() {
   // console.log('clearing localstorage')
    //localStorage.clear();
  }

  render() {
    return (
      <LoginContext.Provider value={this.state}>
        <Router>
          <div className="App">
          <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/watchlist" component={Watchlist} />
            </Switch>
          </div>
        </Router>
      </LoginContext.Provider>
    );
  }
}

export default App;