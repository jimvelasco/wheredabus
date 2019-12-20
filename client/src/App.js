import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import BusesMapMain from "./components/buses/BusesMapMain";
import RegisterBus from "./components/buses/RegisterBus";
import TrackBus from "./components/buses/TrackBus";
import TestApi from "./components/buses/TestApi";
import GMap from "./components/common/GMap";

import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/busesmain" component={BusesMapMain} />
          <Route exact path="/registerbus" component={RegisterBus} />
          <Route exact path="/trackbus" component={TrackBus} />
          <Route exact path="/testapi" component={TestApi} />
          <Route exact path="/gmap" component={GMap} />

          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
          </header> */}
          {/* <Login /> */}
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
