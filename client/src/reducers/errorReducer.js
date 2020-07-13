const defaultState = {
  msg: {},
  status: null,
  id: null
}

const errorReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_ERRORS":
      return {
        msg: action.data.msg,
        status: action.data.status,
        id: action.data.id
      };
    case "CLEAR_ERRORS":
      return {
        msg: {},
        status: null,
        id: null
      };
    default: 
      return state;
  }
}

export default errorReducer