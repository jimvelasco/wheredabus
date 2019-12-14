import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { registerBus } from "../../actions/busActions";
import MapLookup from "../common/MapLookup";

//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";

class RegisterBus extends Component {
  constructor() {
    super();
    this.state = {
      ownerid: "",
      name: "yampa",
      address: "2626 Longthong",
      city: "Steamboat Springs",
      state: "CO",
      zip: "80487",
      route: "Yampa",
      lat: "40.485",
      lon: "-106.8317",
      curlat: "",
      curlon: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      //this.props.history.push("/dashboard");
    }
  }

  // if we have errors this will run
  componentWillReceiveProps(nextProps) {
    //console.log("register componentWillReceiveProps");
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      // setState triggers a render
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCancelClick(e) {
    e.preventDefault();
    window.location = "/";
  }
  handleMapClick(lat, lon) {
    let slat = lat.toString();
    let slon = lon.toString();
    console.log("handlemapclick", lat, lon);
    this.setState({ lat: lat, lon: lon });
  }

  onSubmit(e) {
    e.preventDefault();

    let ownerid = this.props.auth.user.id;
    console.log(this.props.auth.user);
    console.log("ownerid", ownerid);

    const newBus = {
      ownerid: ownerid,
      name: this.state.name,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      route: this.state.route,
      lat: this.state.lat,
      lon: this.state.lon,
      curlat: 0,
      curlon: 0
    };

    // this is the redux way.
    // the register user is in authActions
    // this.props.registerUser(newUser, this.props.history);

    // we add this.props.history so the authActions will have it and be able to redirect

    // console.log(newUser);
    // axios
    //   .post("/api/users/register", newUser)
    //   .then(res => console.log(res.data))
    //   //.catch(err => console.log(err.response.data)); // to get actual errors from backend
    //   .catch(err => this.setState({ errors: err.response.data })); // to get actual errors from backend

    this.props.registerBus(newBus, this.props.history);
  }

  render() {
    const { errors } = this.state;
    const lat = this.state.lat;
    const lon = this.state.lon;
    // same as const errors = this.state.errors

    // this was used to show user from props
    // const { user } = this.props.auth; // const user = this.props.auth.user
    // this shows user {user ? user.name : null}
    // yampa 40.454579 -106.798609
    // eagle ridge 40.455143 -106.808900
    // gondola 40.457226 -106.805936
    // sunburst 40.447014 -106.805257
    // walgreens 40.46657, -106.826904
    // downtown 40.486100, -106.832911

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Register Bus</h1>

              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Name"
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Address"
                    placeholder="Address"
                    name="address"
                    value={this.state.address}
                    onChange={this.onChange}
                    error={errors.address}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="City"
                    placeholder="City"
                    name="city"
                    value={this.state.city}
                    onChange={this.onChange}
                    error={errors.city}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="State"
                    placeholder="State"
                    name="state"
                    value={this.state.state}
                    onChange={this.onChange}
                    error={errors.state}
                  />
                </div>

                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Zip"
                    placeholder="Zip Code"
                    name="zip"
                    value={this.state.zip}
                    onChange={this.onChange}
                    error={errors.zip}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Route"
                    placeholder="Route"
                    name="route"
                    value={this.state.route}
                    onChange={this.onChange}
                    error={errors.route}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Latitude"
                    placeholder="Latitude"
                    name="lat"
                    value={this.state.lat}
                    onChange={this.onChange}
                    error={errors.lat}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    label="Longitude"
                    placeholder="Longitude"
                    name="lon"
                    value={this.state.lon}
                    onChange={this.onChange}
                    error={errors.lon}
                  />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
                <a
                  href=""
                  className="btn btn-info btn-block mt-4"
                  onClick={this.onCancelClick.bind(this)}
                >
                  Cancel
                </a>
              </form>
              <MapLookup
                handleMapClick={this.handleMapClick}
                // lat={lat}
                // lon={lon}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// this is good practice because it will help debugging
// it is not checked when in production mode.
RegisterBus.propTypes = {
  //registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// map errors to this component
// then we can use this.props.auth.user etc
// since we mapped error, we can use componentWillReceiveProps method
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(mapStateToProps, { registerBus })(
  withRouter(RegisterBus)
);
// wrap the Register with withRouter so the authAction can use history to redirect
