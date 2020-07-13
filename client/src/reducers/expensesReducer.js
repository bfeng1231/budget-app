const defaultState = {
  items: []
}

const expensesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_EXPENSES":
      return {items: [...action.data]};
    case "POST_EXPENSES":
      console.log('added', action.data)
      return {items: [action.item, ...state.items]};
    case "DELETE_EXPENSES":
      return {items: [...action.data.filter(elem => elem.uid !== action.id)]};
    default: 
      return state;
  }
}

export default expensesReducer