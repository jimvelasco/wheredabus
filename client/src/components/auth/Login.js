import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import { Button } from "react-bootstrap";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      // email: "jim@lodgingdeals.com",
      // password: "123456",
      // password: "m1rr0r",
      email: "j@e.com",
      password: "123456",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  // this will make the user go to shuttles if they use localhost:3000/login or real url
  componentDidMount() {
    // console.log("login component did mount");
    if (this.props.auth.isAuthenticated) {
      //this.props.history.push("/dashboard");
      this.props.history.push("/");
    }
  }
  // so after successful login we go to shuttles
  componentWillReceiveProps(nextProps) {
    // console.log("login component will receive props");
    if (nextProps.auth.isAuthenticated) {
      // login success takes them to home page
      //this.props.history.push("/dashboard");
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  onCancelClick(e) {
    e.preventDefault();
    window.location = "/";
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container xshadow-lg">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-5 text-center">Sign In</h1>

              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    type="email"
                    label="Email"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="password"
                    label="Password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                </div>

                {/* <input type="submit" className="btn btn-info btn-block mt-4" /> */}
                <Button
                  variant="info"
                  type="submit"
                  className="btn-block"
                  value="Submit"
                >
                  Submit
                </Button>

                <Button
                  variant="info"
                  className="btn-block"
                  onClick={this.onCancelClick.bind(this)}
                >
                  Cancel
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

// call loginUser in actions file
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
