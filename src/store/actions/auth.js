import * as actionTypes from './actionTypes';

import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password,
      returnSecureToken: true,
    };
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNUB2wDo39omzHeyLNbPtAh5ViSzv0bT8';
    if (!isSignUp) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNUB2wDo39omzHeyLNbPtAh5ViSzv0bT8';
    }
    axios
      .post(url, authData)
      .then((resp) => {
        const expirationDate = new Date(new Date().getTime() + resp.data.expiresIn * 1000);
        localStorage.setItem('token', resp.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', resp.data.localId);
        dispatch(authSuccess(resp.data.idToken, resp.data.localId));
        dispatch(checkAuthTimeout(resp.data.expiresIn));
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirect = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));

      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
