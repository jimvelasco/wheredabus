import React, { Component } from "react";
// we need to get into git
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

//import Trips from "../shuttles/Trips";
//import Advertisers from "../advertisers/Advertisers";
//import Advertisements from "../advertisements/Advertisements";

//import Businesses from "../businesses/Businesses";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {}; //shuttles: ["one", "two", "three"] };
    // console.log("Dashboard props", props);
  }
  render() {
    const userrole = this.props.auth.user.role;
    const { isAuthenticated, user } = this.props.auth; // shorthand
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>Dashboard: {user.name}</h3>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <Button
              variant="info"
              className="btn-block"
              onClick={() => {
                this.props.history.replace("/registerbus");
              }}
            >
              Register Bus
            </Button>
            {/* <Button
              variant="info"
              as={Link}
              to="/registerbus"
              className="btn-block"
            >
              Register Bus
            </Button> */}
            <br />
            <Button
              variant="info"
              className="btn-block"
              onClick={() => {
                this.props.history.replace("/busesmain");
              }}
            >
              Locate Bus
            </Button>
            <br />
            <Button
              variant="info"
              className="btn-block"
              onClick={() => {
                this.props.history.replace("/trackbus");
              }}
            >
              Track Bus
            </Button>
            {/* <Button
              variant="info"
              as={Link}
              to="/busesmain"
              className="btn-block"
            >
              Locate Bus
            </Button>

            <Button variant="info" className="btn-block">
              Dummy
            </Button> */}
          </div>
        </div>

        {/* {userrole === "admin" ? <Advertisers /> : null}
/        <Businesses /> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);

//export default Dashboard;
