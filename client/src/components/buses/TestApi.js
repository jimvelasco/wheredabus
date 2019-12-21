import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import mapicon from "../../img/blue.png";
import SelectCategoryGroup from "../common/SelectCategoryGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import socketIO from "socket.io-client";

// yampa 40.454579 -106.798609
// eagle ridge 40.455143 -106.808900
// gondola 40.457226 -106.805936
// sunburst 40.447014 -106.805257
// walgreens 40.46657, -106.826904
// downtown 40.486100, -106.832911

class TestApi extends Component {
  constructor(props) {
    super(props);
    console.log("tb props", props);

    this.state = {
      curmarkerid: "",
      markers: [],
      lat: null,
      lon: null,
      cnt: 2,
      room_list: [
        "yampa",
        "eagle",
        "gondola",
        "sunburst",
        "walgreens",
        "downtown"
      ],
      selected_room: "yampa",
      cur_room: "yampa",
      bounds: null,
      errors: {},
      //socket: socketIO("http://127.0.0.1:5000")
      socket: socketIO("http://wheredabus.herokuapp.com")
      //socket: socketIO("http://10.0.0.2:5000")
    };
    this._map = null;
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.onChange = this.onChange.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.addRoom = this.addRoom.bind(this);
    this.sendRoom = this.sendRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.sendLatLon = this.sendLatLon.bind(this);
    this.doDisconnect = this.doDisconnect.bind(this);

    this.counter = 1;

    //this.getBusLocation = this.getBusLocation.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    console.log("cdm");
    let room = "yampa";
    // this.state.socket.emit("room", room);

    this.state.socket.on("broadcast", function(data) {
      //setSocketMessage(data);
      console.log("BROADCAST response from socket", data);
    });

    let sock = this.state.socket;

    // setInterval(function() {
    //   let objstr = "now is the time";
    //   sock.emit("toapi", objstr);
    // });
  }
  connectSocket(e) {
    e.preventDefault();
    console.log("we are creating a new socket");
    //let sock = new socketIO("http://10.0.0.2:5000");
    let sock = new socketIO("http://wheredabus.herokuapp.com");
    this.setState({ socket: sock }); //sockET("http://10.0.0.2:5000");
    sock.on("broadcast", function(data) {
      //setSocketMessage(data);
      console.log("BROADCAST reconnect response from socket", data);
    });
  }

  sendLatLon(e) {
    e.preventDefault();
    let sock = this.state.socket;
    // setInterval(function() {
    //let room = "yampa";
    let room = this.state.selected_room;
    //let objstr = "now is the time";
    // sb
    let lat = 40.4534379581993;
    let lon = -106.80503115088976;
    // bldr
    // let lat = 37.785834;
    // let lon = -122.406417;
    let ulat = lat + this.counter / 2000;
    let ulon = lon + this.counter / 2000;
    this.counter = this.counter + 1;
    let obj = {
      busid: "5ded3cf5c203da39c4d01cf6",
      busname: room,
      lat: ulat,
      lon: ulon
    };
    let objstr = JSON.stringify(obj);
    sock.emit("toapi", room, objstr);
    //  }, 3000);
  }

  getRooms(e) {
    e.preventDefault();
    let sock = this.state.socket;
    // setInterval(function() {
    let room = "yampa";

    this.counter = this.counter + 1;
    let obj = {
      room: room,
      counter: this.counter
    };
    let objstr = JSON.stringify(obj);
    sock.emit("get_rooms", room, objstr);
    //  }, 3000);
  }

  addRoom(e) {
    e.preventDefault();
    let sock = this.state.socket;
    let room = this.state.selected_room; //"yampa2";
    this.state.socket.emit("room", room);
    //  }, 3000);
  }
  sendRoom(e) {
    e.preventDefault();
    let sock = this.state.socket;
    let room = this.state.selected_room; //"yampa2";
    let msg = "message for room " + room;
    let msgobj = {};
    msgobj["message"] = msg;
    this.state.socket.emit("toapi", room, msgobj);
    //  }, 3000);
  }

  leaveRoom(e) {
    e.preventDefault();
    let sock = this.state.socket;
    let room = this.state.selected_room; //"yampa2";
    this.state.socket.emit("leaveroom", room);
    //  }, 3000);
  }
  doDisconnect(e) {
    e.preventDefault();
    this.state.socket.disconnect();
  }

  componentWillReceiveProps(nextProps) {
    console.log("cwrp");
    //let bl = dummy_data.map

    this.state.socket.on("fromapi", function(data) {
      //setSocketMessage(data);
      console.log("we got a CWRP WEB response from socket", data);
    });
  }

  render() {
    //console.log("maplookup props", this.props);
    // console.log("mapbusines render");
    let { lat } = this.state;
    let { lon } = this.state;
    let posobj = { lat: 40.485, lng: -106.8317 };
    let posobj2 = { lat: 40.485, lng: -106.8317 };
    let cposobj = { lat: 40.4863, lng: -106.8328 };
    // console.log("render state is ", this.state);
    const { errors } = this.state;

    // const { businesses } = this.props.advertise;
    // let mary = [];
    // businesses.map((business, index) => {
    //   mary.push({
    //     lat: business.latitude,
    //     lng: business.longitude,
    //     name: business.name,
    //     id: business._id,
    //     show: false
    //   });
    //   console.log(business);
    // });

    if (lat) {
      posobj = { lat: lat, lng: lon };
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="form-group">
              <SelectCategoryGroup
                label="Room"
                name="selected_room"
                list={this.state.room_list}
                value={this.state.selected_room}
                onChange={this.onChange}
                error={errors.selected_room}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="form-group">
              <TextFieldGroup
                type="text"
                label="Current Room"
                placeholder="Current Room"
                name="cur_room"
                value={this.state.cur_room}
                onChange={this.onChange}
                error={errors.cur_room}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.connectSocket}
            >
              Connect
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.getRooms}
            >
              Show Rooms
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.addRoom}
            >
              Add Room
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.leaveRoom}
            >
              Leave Room
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.sendRoom}
            >
              Send Room
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.sendLatLon}
            >
              Send Lat Lon
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.doDisconnect}
            >
              Disconnect
            </a>
          </div>
        </div>
        <h4 style={{ textAlign: "center" }}>Track Bus</h4>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(mapStateToProps, {})(TestApi);
