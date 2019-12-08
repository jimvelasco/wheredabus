import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import mapicon from "../../img/blue.png";
import SelectCategoryGroup from "../common/SelectCategoryGroup";
import TextFieldGroup from "../common/TextFieldGroup";

import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
//import { getBusinesses } from "../../actions/advertiseActions";

const posobj = { lat: 40.485, lng: -106.8317 };

const xdummy_data = [
  { name: "yampa", lat: 40.454579, lng: -106.798609 },
  { name: "eagle", lat: 40.455143, lng: -106.8089 },
  { name: "gondola", lat: 40.457226, lng: -106.805936 },
  { name: "sunburst", lat: 40.447014, lng: -106.805257 },
  { name: "walgreens", lat: 40.46657, lng: -106.826904 },
  { name: "downtown", lat: 40.4861, lng: -106.832911 }
];

const dummy_data = [
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
  <GoogleMap defaultCenter={posobj} defaultZoom={13}>
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
      distance: 1000,
      errors: {}
    };
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.loadBuses = this.loadBuses.bind(this);
    this.onChange = this.onChange.bind(this);

    //this.getBusLocation = this.getBusLocation.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    console.log("cdm");
    //let bl = dummy_data.map
    let bl = dummy_data.map((obj, index) => obj.name);
    this.setState({ location_list: bl });
    // let link = "/api/buses/find_bus/5d03d5419965471cd70f957d";
    // console.log("track bus cdm", link);
    // axios
    //   .get(link)
    //   .then(res => {
    //     let bus = res.data;
    //     console.log("bus", bus);
    //     let mary = [];
    //     let posobj = {
    //       lat: bus.lat,
    //       lng: bus.lon,
    //       name: bus.name,
    //       id: bus.ownerid,
    //       adname: bus.route
    //     };
    //     mary.push(posobj);
    //     this.setState({ markers: mary });
    //   })
    //   .catch(err => {
    //     console.log("triggering error in actions", err.message);
    //   });
    // setInterval(function() {
    //   getBusLocation;
    // }, 3000);
    //setInterval(() => this.getBusLocation(), 15000);
  }

  loadBuses(e) {
    e.preventDefault();
    let mary = [];
    let posobj = {
      lat: 40.482,
      lng: -106.8317,
      name: "bus one",
      id: 1,
      adname: "Yampa View",
      addesc: "Service 24x7"
    };
    let posobj2 = {
      lat: 40.485,
      lng: -106.8317,
      name: "bus two",
      id: 2,
      adname: "Ski Inn",
      addesc: "Service 8 to 5"
    };
    let cposobj = {
      lat: 40.46657,
      lng: -106.826904,
      name: "walgreens",
      id: 3,
      adname: "walgreens",
      addesc: "Weekdays only"
    };
    mary.push(posobj);
    mary.push(posobj2);
    mary.push(cposobj);
    //console.log("load buses clicked", mary);
    //this.setState({ markers: mary });
    this.postLoadBuses();
  }

  getLoadBuses() {
    //let cnt = this.state.cnt;
    let ownerid = "5d00680c0919b8453349d5a3";
    let link = "/api/buses/bus_markers/" + ownerid;
    //this.setState({ cnt: cnt + 1 });

    console.log("getLoadBuses query", link);
    let mary = [];
    axios
      .get(link)
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
        this.setState({ markers: mary });
      })
      .catch(err => {
        console.log("triggering error in actions", err.message);
      });
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
    console.log("pdata sending", pdata);
    //this.setState({ cnt: cnt + 1 });

    console.log("getLoadBuses query", link);
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
        this.setState({ markers: mary });
      })
      .catch(err => {
        console.log("triggering error in actions", err.message);
      });
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

  componentWillReceiveProps(nextProps) {
    console.log("cwrp");
    //console.log("manage photos current props ", this.props);
    //console.log("business map nextProps ", nextProps);
    // let bizes = nextProps.advertise.businesses;
    // let mary = [];
    // bizes.map((biz, index) => {
    //   mary.push({
    //     lat: biz.latitude,
    //     lng: biz.longitude,
    //     name: biz.name,
    //     id: biz._id,
    //     show: false
    //   });
    //   this.setState({ markers: mary });
    // });
    //console.log("maps next props cdm", nextProps);
    //this.setState({ lat: nextProps.lat, lon: nextProps.lon });
  }

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
