import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//import { TEST_DISPATCH } from "./types";
// REGISTER

// must return type always
// export const registerUser = userData => {
//   // console.log("we are in authactions");
//   // this then goes to the reducer.  TEST_DISPATCH happens to be in authReducer
//   return {
//     type: TEST_DISPATCH,
//     payload: userData
//   };
//};

import { GET_ERRORS, SET_CURRENT_BUS } from "./types";

// Register User
// we passed in the history for Register component so now we can redirect
export const registerBus = (busData, history) => dispatch => {
  axios
    .post("/api/buses/register_bus", busData)
    .then(res => history.push("/dashboard"))
    // thunk lets us do a dispatch
    // .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
