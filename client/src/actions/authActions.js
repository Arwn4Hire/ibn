import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';



// register user
export const registerUser = (userData, history) => dispatch => {
    axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
    );
};

// login -get user token
export const loginUser = (userData) => dispatch => {
    axios
    .post('/api/users/login', userData)
    .then(res => {
        // save to local storage
        const { token } = res.data;
        // set token to ls
        localStorage.setItem('jwtToken', token);
        // set token to auth header
        setAuthToken(token);
        // decode token to get user data
        const decoded = jwt_decode(token);
        // set current user
        dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         }));
};

// set logged inuser
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// log user out
export const logoutUser = () => dispatch => {
    // remove token from localstorage
    localStorage.removeItem('jwtToken');
    // remove auth header for futur request
    setAuthToken(false);
    // set current user to empty which will set is auth to false
    dispatch(setCurrentUser({}));
}