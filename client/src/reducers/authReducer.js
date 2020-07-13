const defaultState = {
  token: localStorage.getItem('token'),
  isAuth: null,
  user: null
}

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_USER":
      console.log('Getting user', action.data)
      return {
        user: action.data,
        isAuth: true
      };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      console.log('logging in', action.data);
      localStorage.setItem('token', action.data.token)
      return {
        ...action.data,
        isAuth: true
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "REGISTER_FAIL":
    case "LOGOUT":
      localStorage.removeItem('token');
      return {
        token: null,
        isAuth: false,
        user: null,
      };
    case "CHANGE_BUDGET":
    case "CHANGE_PROFILE":
    case "CHANGE_USERNAME":
      console.log(action.data)
      return {
        ...state,
        user: {...action.data, ...action.payload}
      }
    case "CHANGE_EMAIL":
    case "CHANGE_PASSWORD":
      console.log(action.data)
      return {
        user: action.data,
        ...state
      }
    case "UPDATE_FAIL":
    default: 
      return state;
  }
}

export default authReducer