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

class GMap extends Component {
  constructor(props) {
    super(props);
    this.state = { lat: 40.485, lon: -106.8317, map: {}, markers: [] };
    //console.log(props);
    // console.log("Dashboard props", props);
    let lat = null;
    this.handleClick = this.handleClick.bind(this);
    this.addMarkers = this.addMarkers.bind(this);
  }

  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.454579, lng: -106.798609 },
      zoom: 13,
      mapTypeId: "roadmap"
    });

    this.setState({ map: map });
  }
  //40.454579 -106.798609
  //40.455143 -106.808900
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
  addMarkers(e) {
    e.preventDefault();
    //this.setState({ [e.target.name]: e.target.value });
    // let lat = event.latLng.lat();
    // let lng = event.latLng.lng();
    // //console.log(lat + " " + lng);
    // this.props.handleMapClick(lat, lng);
    // this.setState({ lat: lat, lon: lng });
    console.log("adding markers");
    let { map } = this.state;
    let marker = new window.google.maps.Marker({
      map: map,
      position: { lat: 40.454579, lng: -106.798609 }
    });
    let amarker = new window.google.maps.Marker({
      map: map,
      position: { lat: 40.455143, lng: -106.8089 }
    });
  }

  render() {
    return (
      <div id="app">
        <div id="map" />
        <a
          href=""
          className="btn btn-info btn-block mt-4"
          //onClick={this.onCancelClick.bind(this)}
          onClick={this.addMarkers}
        >
          Add Markers
        </a>
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

export default connect(mapStateToProps, null)(GMap);
// wrap the Register with withRouter so the authAction can use history to redirect

//export default Map;

//onClick={(e) => handleClick(e)}

//function handleClick(event) {var lat = event.latLng.lat(), lng = event.latLng.lng()}
