import { returnErrors } from './errorActions'

export const getUser = () => (dispatch, getState) => {
  const token = getState().authReducer.token;

  const config = {
    method: 'GET',
    headers: {"Content-type": "application/json"}
  }
  if (token)
    config.headers['x-auth-token'] = token

  fetch('/api/user', config)
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'GET_USER',
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status))
      dispatch({type: 'AUTH_ERROR'})
    }))
}

// Register user
export const register = ({email, username, password}) => dispatch => {
  const body = JSON.stringify({email, username, password});

  fetch('/api/user/register', {method: 'POST', headers: {"Content-type": "application/json"}, body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'REGISTER_SUCCESS', 
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'REGISTER_FAIL'))
      dispatch({type: 'REGISTER_FAIL'})
    }))
}

// Logout user
export const logout = () => {
  return {type: 'LOGOUT'}
}

// Login user
export const login = ({email, password}) => dispatch => {
  const body = JSON.stringify({email, password});
  fetch('/api/user/login', {method: 'POST', headers: {"Content-type": "application/json"}, body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
        type: 'LOGIN_SUCCESS', 
        data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'LOGIN_FAIL'))
      dispatch({type: 'LOGIN_FAIL'})
    }))
}

// Change user's budget
export const changeBudget = (token, budget) => dispatch => {
  const body = JSON.stringify({budget});

  fetch('/api/user/budget', {method: 'POST', 
    headers: {"Content-type": "application/json","x-auth-token": token}, 
    body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'CHANGE_BUDGET',
      payload: {budget}, 
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'UPDATE_FAIL'))
      dispatch({type: 'UPDATE_FAIL'})
    }))
}

// Change user's profile picture
export const changeProfile = (token, profile) => dispatch => {
  const body = JSON.stringify({profile});

  fetch('/api/user/profile', {method: 'POST', 
    headers: {"Content-type": "application/json","x-auth-token": token}, 
    body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'CHANGE_PROFILE',
      payload: {profile}, 
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'UPDATE_FAIL'))
      dispatch({type: 'UPDATE_FAIL'})
    }))
}

// Change user's username
export const changeUsername = (token, username) => dispatch => {
  const body = JSON.stringify({username});

  fetch('/api/user/username', {method: 'POST', 
    headers: {"Content-type": "application/json","x-auth-token": token}, 
    body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'CHANGE_USERNAME',
      payload: {username}, 
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'UPDATE_FAIL'))
      dispatch({type: 'UPDATE_FAIL'})
    }))
}

// Change user's email
export const changeEmail = (token, email) => dispatch => {
  const body = JSON.stringify({email});

  fetch('/api/user/email', {method: 'POST', 
    headers: {"Content-type": "application/json","x-auth-token": token}, 
    body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'CHANGE_EMAIL',
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'UPDATE_FAIL'))
      dispatch({type: 'UPDATE_FAIL'})
    }))
}

// Change user's password
export const changePassword = (token, password, newPassword) => dispatch => {
  const body = JSON.stringify({password, newPassword});

  fetch('/api/user/password', {method: 'POST', 
    headers: {"Content-type": "application/json","x-auth-token": token}, 
    body})
    .then(res => {
      if (!res.ok)
        throw res;
      return res.json();
    })
    .then(data => dispatch({
      type: 'CHANGE_PASSWORD',
      data
    }))
    .catch(err => err.json().then(data => {
      dispatch(returnErrors(data.msg, err.status, 'UPDATE_FAIL'))
      dispatch({type: 'UPDATE_FAIL'})
    }))
}