import React, { Component } from "react";
import { connect } from "react-redux";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

// let posobj = { lat: 40.485, lng: -106.8317 };
// const GoogleMapExample = withGoogleMap(props => (
//   <GoogleMap defaultCenter={posobj} defaultZoom={15} onClick={props.onClick}>
//     <Marker position={posobj} />
//   </GoogleMap>
// ));

const posobj = { lat: 40.485, lng: -106.8317 };

// const xxGoogleMapExample = withGoogleMap(props => (
//   <GoogleMap defaultCenter={posobj} defaultZoom={13}>
//     {props.markers.map((marker, index) => (
//       <Marker
//         key={index}
//         position={{ lat: marker.lat, lng: marker.lng }}
//         // onClick={props.onMarkerClick.bind(this, marker.id)}
//         // icon={mapicon}
//       >
//         {marker.show && (
//           <InfoWindow onCloseClick={props.onCloseClick.bind(this, marker.id)}>
//             <div>
//               <div className="marker-text">
//                 <b>{marker.name}</b>
//               </div>
//               <div className="marker-text">{marker.adname}</div>
//               <div className="marker-text">{marker.addesc}</div>
//               <div className="marker-text">{marker.addisc}</div>
//             </div>
//           </InfoWindow>
//         )}
//       </Marker>
//     ))}
//   </GoogleMap>
// ));

class MapLookup extends Component {
  constructor(props) {
    super(props);
    this.state = { lat: 40.485, lon: -106.8317 };
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // console.log("maps cdm", this.props);
    this.setState({ lat: this.props.lat, lon: this.props.lon });
  }

  componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps photos current props ", this.props);
    //console.log("manage photos nextProps ", nextProps);
    //console.log("maps next props cdm", nextProps);
    this.setState({ lat: nextProps.lat, lon: nextProps.lon });
  }

  handleClick(event) {
    //this.setState({ [e.target.name]: e.target.value });
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    //console.log(lat + " " + lng);
    this.props.handleMapClick(lat, lng);
    this.setState({ lat: lat, lon: lng });
  }
  render() {
    //console.log("maplookup props", this.props);
    let { lat } = this.state;
    let { lon } = this.state;
    let posobj = { lat: 40.485, lng: -106.8317 };
    let cposobj = { lat: 40.485, lng: -106.8317 };
    let themarkers = [];
    themarkers.push(posobj);

    if (lat) {
      posobj = { lat: lat, lng: lon };
    }

    console.log("posobj", posobj);

    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={posobj}
        defaultZoom={15}
        onClick={this.handleClick}
      >
        <Marker position={posobj} />
      </GoogleMap>
    ));

    return (
      <div>
        <h4 style={{ textAlign: "center" }}>Location Lookup</h4>
        <h6 style={{ textAlign: "center" }}>
          (click on map to locate your bus)
        </h6>
        <div className="row">
          <div className="col-md-10 offset-md-1 ">
            <GoogleMapExample
              containerElement={
                <div style={{ height: `500px`, width: "100%" }} />
              }
              mapElement={<div style={{ height: `100%` }} />}
              // markers={themarkers}
              // onClick={this.handleClick}
            >
              onClick = (e) => this.handleClick(e)
            </GoogleMapExample>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  advertise: state.advertise
});
// the state.auth above comes from rootReducer in index.js in reducers.

export default connect(mapStateToProps, null)(MapLookup);
// wrap the Register with withRouter so the authAction can use history to redirect

//export default Map;

//onClick={(e) => handleClick(e)}

//function handleClick(event) {var lat = event.latLng.lat(), lng = event.latLng.lng()}
