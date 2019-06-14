import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
//import { registerUser } from "../../actions/authActions";

//import axios from "axios";
//import classnames from "classnames";

import TextFieldGroup from "../common/TextFieldGroup";

class RegisterBus extends Component {
  constructor() {
    super();
    this.state = {
      ownerid: "",
      name: "",
      city: "",
      state: "",
      zip: "",
      route: "",
      lat: "40.485",
      lon: "-106.8317",
      curlat: "",
      curlon: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

  onSubmit(e) {
    e.preventDefault();

    const newBus = {
      ownerid: this.state.ownerid,
      name: this.state.name,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      lat: this.state.lat,
      lon: this.state.lon,
      curlat: this.state.curlat,
      curlon: this.state.curlon
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

    // this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;
    // same as const errors = this.state.errors

    // this was used to show user from props
    // const { user } = this.props.auth; // const user = this.props.auth.user
    // this shows user {user ? user.name : null}

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

export default connect(
  mapStateToProps,
  {}
)(withRouter(RegisterBus));
// wrap the Register with withRouter so the authAction can use history to redirect
