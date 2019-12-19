import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import mapicon from "../../img/blue.png";
import SelectCategoryGroup from "../common/SelectCategoryGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import socketIO from "socket.io-client";

import {
  withGoogleMap,
  GoogleMapLoader,
  GoogleMap,
  Marker,
  InfoWindow,
  LatLngBounds,
  withScriptjs
} from "react-google-maps";
//import { getBusinesses } from "../../actions/advertiseActions";

const posobj = { lat: 40.485, lng: -106.8317 };
const googleMapURL =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyAnVhbl1bPiwiJaIc6hoxWf3MZecJijJEUlibraries=places,geometry";

//const { LatLng, LatLngBounds } = google.maps;

const xdummy_data = [
  { name: "yampa", lat: 40.454579, lng: -106.798609 },
  { name: "eagle", lat: 40.455143, lng: -106.8089 },
  { name: "gondola", lat: 40.457226, lng: -106.805936 },
  { name: "sunburst", lat: 40.447014, lng: -106.805257 },
  { name: "walgreens", lat: 40.46657, lng: -106.826904 },
  { name: "downtown", lat: 40.4861, lng: -106.832911 }
];

const dummy_data = [
  { name: "", coordinates: [0, 0] },
  { name: "yampa", coordinates: [-106.798609, 40.454579] },
  { name: "eagle", coordinates: [-106.8089, 40.455143] },
  { name: "gondola", coordinates: [-106.805936, 40.457226] },
  { name: "sunburst", coordinates: [-106.805257, 40.447014] },
  { name: "walgreens", coordinates: [-106.826904, 40.46657] },
  { name: "downtown", coordinates: [-106.832911, 40.4861] }
];

// yampa 40.454579 -106.798609
// eagle ridge 40.455143 -106.808900
// gondola 40.457226 -106.805936
// sunburst 40.447014 -106.805257
// walgreens 40.46657, -106.826904
// downtown 40.486100, -106.832911

const GoogleMapExample = withGoogleMap(props => (
  <GoogleMap
    defaultCenter={posobj}
    defaultZoom={13}
    // ref={map => (this._map = map)}
  >
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={props.onMarkerClick.bind(this, marker.id)}
        icon={mapicon}
      >
        {marker.show && (
          <InfoWindow onCloseClick={props.onCloseClick.bind(this, marker.id)}>
            <div>
              <div className="marker-text">
                <b>{marker.name}</b>
              </div>
              <div className="marker-text">{marker.adname}</div>
              <div className="marker-text">{marker.addesc}</div>
              <div className="marker-text">{marker.addisc}</div>
            </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

class TrackBus extends Component {
  constructor(props) {
    super(props);
    console.log("tb props", props);

    this.state = {
      curmarkerid: "",
      markers: [],
      lat: null,
      lon: null,
      cnt: 2,
      location_list: ["one", "two"],
      selected_location: "",
      distance: 2000,
      bounds: null,
      errors: {},
      socket: socketIO("http://127.0.0.1:5000")
    };
    this._map = null;
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.loadBuses = this.loadBuses.bind(this);
    this.onChange = this.onChange.bind(this);
    this.doBounds = this.doBounds.bind(this);
    this.updateBus = this.updateBus.bind(this);
    this.doSocket = this.doSocket.bind(this);
    this.counter = 1;

    //this.getBusLocation = this.getBusLocation.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    console.log("cdm");
    let room = "yampa";
    this.state.socket.emit("room", room);

    this.state.socket.on("broadcast", function(data) {
      //setSocketMessage(data);
      console.log("we got a CWRP BROADCASR WEB response from socket", data);
    });

    let sock = this.state.socket;

    // setInterval(function() {
    //   let objstr = "now is the time";
    //   sock.emit("toapi", objstr);
    // });
  }
  doSocket(e) {
    e.preventDefault();
    let sock = this.state.socket;
    // setInterval(function() {
    let room = "yampa";
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
      busname: "sunburst",
      lat: ulat,
      lon: ulon
    };
    let objstr = JSON.stringify(obj);
    sock.emit("toapi", room, objstr);
    //  }, 3000);
  }

  o_componentDidMount() {
    console.log("cdm");
    //let bl = dummy_data.map
    let bl = dummy_data.map((obj, index) => obj.name);
    this.setState({ location_list: bl });
    this.state.socket.on("fromapi", function(data) {
      //setSocketMessage(data);
      console.log("we got a WEB response from socket", data);
      if (data === "CONNECTION SUCCESS") {
        // getBusLocationAsync();
      }
    });

    this.state.socket.on("broadcast", function(data) {
      //setSocketMessage(data);
      console.log("we got a CWRP BROADCASR WEB response from socket", data);
    });

    let sock = this.state.socket;

    // setInterval(function() {
    //   let objstr = "now is the time";
    //   sock.emit("toapi", objstr);
    // });
  }

  componentWillReceiveProps(nextProps) {
    console.log("cwrp");
    //let bl = dummy_data.map

    this.state.socket.on("fromapi", function(data) {
      //setSocketMessage(data);
      console.log("we got a CWRP WEB response from socket", data);
    });
  }

  loadBuses(e) {
    e.preventDefault();

    this.postLoadBuses();
  }

  postLoadBuses() {
    //let cnt = this.state.cnt;
    let ownerid = "5d00680c0919b8453349d5a3";
    let link = "/api/buses/bus_markers";
    let { selected_location } = this.state;
    let { distance } = this.state;

    const result = dummy_data.filter(el => el.name === selected_location);
    console.log("result is", result);
    let coords = result[0].coordinates;

    // let pdata = {
    //   ownerid: ownerid,
    //   selected_location: selected_location,
    //   coordinates: coords,
    //   distance: distance
    // };
    let pdata = {
      ownerid: ownerid,
      selected_location: selected_location,
      lat: coords[1],
      lon: coords[0],
      distance: distance
    };
    //console.log("pdata sending", pdata);
    //this.setState({ cnt: cnt + 1 });

    //console.log("getLoadBuses query", link);
    let mary = [];
    //.post("/api/users/register", userData)
    axios
      .post(link, pdata)
      .then(res => {
        let buses = res.data;
        console.log("buses", buses);
        buses.forEach(bus => {
          //console.log("the bus is", bus);
          let coords = bus.location.coordinates;
          //console.log("the coords are ", coords);
          let lat = bus.lat;
          let lon = bus.lon;
          lat = coords[1];
          lon = coords[0];
          let posobj = {
            lat: lat,
            lng: lon,
            name: bus.name,
            id: bus.ownerid,
            adname: bus.route
          };
          mary.push(posobj);
        });
        const bounds = new window.google.maps.LatLngBounds();
        mary.map((item, i) => {
          console.log("loc lat lng", item.lat, item.lng);
          const loc = new window.google.maps.LatLng(item.lat, item.lng);
          console.log(loc);
          bounds.extend(loc);
        });
        console.log("bounds", bounds);

        //this.setState({ markers: mary, bounds: bounds });
        console.log("we are done getting buses");
        // this._map.fitBounds(bounds);
        this.setState({ markers: mary, bounds: bounds });
      })
      .catch(err => {
        console.log("triggering error in actions", err.message);
      });
  }

  doBounds(e) {
    e.preventDefault();
    let mary = this.state.markers;
    const bounds = new window.google.maps.LatLngBounds();
    mary.map((item, i) => {
      const loc = new window.google.maps.LatLng(item.lat, item.lng);
      console.log(loc);
      bounds.extend(loc);
    });
    console.log("bounds", bounds);
    console.log("bounds", bounds.getCenter());
    //let tmap = this.refs.gmap;
    let tmap = this._map;
    let tb = tmap.getCenter();
  }

  getBusLocation() {
    let cnt = this.state.cnt;
    let link = "/api/buses/find_bus/5d03d5419965471cd70f957d/" + cnt;
    this.setState({ cnt: cnt + 1 });

    //console.log("track bus cdm", link);
    axios
      .get(link)
      .then(res => {
        let bus = res.data;
        // console.log("bus", bus);
        let mary = [];
        let posobj = {
          lat: bus.lat,
          lng: bus.lon,
          name: bus.name,
          id: bus.ownerid,
          adname: bus.route
        };
        mary.push(posobj);
        this.setState({ markers: mary });
      })
      .catch(err => {
        console.log("triggering error in actions", err.message);
      });
  }

  updateBus() {
    console.log("we are updating bus");
    let cnt = this.state.cnt;
    let link = "/api/buses/updatebus//5ded3d46c203da39c4d01cfa/100/100";
    //http://wheredabus.herokuapp.com/restapi/updatebus/5ded3d46c203da39c4d01cfa/40/100
    this.setState({ cnt: cnt + 1 });

    //console.log("track bus cdm", link);
    axios
      .get(link)
      .then(res => {
        let bus = res.data;
        console.log("bus", bus);
        // let mary = [];
        // let posobj = {
        //   lat: bus.lat,
        //   lng: bus.lon,
        //   name: bus.name,
        //   id: bus.ownerid,
        //   adname: bus.route
        // };
        // mary.push(posobj);
        // this.setState({ markers: mary });
      })
      .catch(err => {
        console.log("triggering error in actions", err.message);
      });
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("cwrp");
  //   //console.log("manage photos current props ", this.props);
  //   //console.log("business map nextProps ", nextProps);
  //   // let bizes = nextProps.advertise.businesses;
  //   // let mary = [];
  //   // bizes.map((biz, index) => {
  //   //   mary.push({
  //   //     lat: biz.latitude,
  //   //     lng: biz.longitude,
  //   //     name: biz.name,
  //   //     id: biz._id,
  //   //     show: false
  //   //   });
  //   //   this.setState({ markers: mary });
  //   // });
  //   //console.log("maps next props cdm", nextProps);
  //   //this.setState({ lat: nextProps.lat, lon: nextProps.lon });
  // }

  // handleClick(event) {
  //   //this.setState({ [e.target.name]: e.target.value });
  //   let lat = event.latLng.lat();
  //   let lng = event.latLng.lng();
  //   //console.log(lat + " " + lng);
  //   this.props.handleMapClick(lat, lng);
  // }

  handleClick(e) {
    console.log("hc e", e);
    e.preventDefault();
    //this.map.fitBounds(this.state.bounds);
  }
  handleCloseClick(bizid) {
    //console.log("handleCloseClick e", bizid);
    // e.preventDefault();
    let smarkers = this.state.markers;
    smarkers.map((marker, index) => {
      if (marker.id === bizid) {
        marker.show = false;
      }
    });

    this.setState({ markers: smarkers });
  }

  handleMarkerClick(bizid) {
    //console.log("hmc clicked ", e);
    // e.preventDefault();
    //this.setState({ [e.target.name]: e.target.value });
    // let lat = event.latLng.lat();
    // let lng = event.latLng.lng();
    let smarkers = this.state.markers;
    smarkers.map((marker, index) => {
      if (marker.id === bizid) {
        if (marker.show) {
          marker.show = false;
        } else {
          marker.show = true;
        }
      }
    });

    this.setState({ markers: smarkers });

    //console.log("marker clicked index ", bizid);
    // this.props.handleMapClick(lat, lng);
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

    let themarkers = this.state.markers;
    console.log("the markers we are rendering are", themarkers);

    return (
      <div>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="form-group">
              <SelectCategoryGroup
                label="Bus"
                name="selected_location"
                list={this.state.location_list}
                value={this.state.selected_location}
                onChange={this.onChange}
                error={errors.selected_location}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="form-group">
              <TextFieldGroup
                type="text"
                label="Distance"
                placeholder="Distance"
                name="distance"
                value={this.state.distance}
                onChange={this.onChange}
                error={errors.distance}
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
              onClick={this.loadBuses}
            >
              Load
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.doBounds}
            >
              Bounds
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.updateBus}
            >
              Update
            </a>
            <a
              href=""
              className="btn btn-info btn-block mt-4"
              //onClick={this.onCancelClick.bind(this)}
              onClick={this.doSocket}
            >
              Socket
            </a>
          </div>
        </div>
        <h4 style={{ textAlign: "center" }}>Track Bus</h4>

        <div className="row">
          <div className="col-md-10 offset-md-1 ">
            <GoogleMapExample
              containerElement={
                <div style={{ height: `500px`, width: "100%" }} />
              }
              mapElement={<div style={{ height: `100%` }} />}
              markers={themarkers}
              onMarkerClick={this.handleMarkerClick}
              onCloseClick={this.handleCloseClick}
              bounds={this.state.bounds}
              //ref={"gmap"}
              ref={map => (this._map = map)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(mapStateToProps, {})(TrackBus);
