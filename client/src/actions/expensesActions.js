export const getExpenses = (token) => (dispatch) => {
  fetch('/api/item', {method: 'GET', headers: {'x-auth-token': token}})
    .then(res => res.json())
    .then(data => dispatch({type: 'GET_EXPENSES', data}))
    .catch(err => console.log(err))
}

export const postExpenses = (token, item) => (dispatch) => {
  fetch('/api/item', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify(item)
  })
    .then(res => res.json())
    .then(data => dispatch({type: 'POST_EXPENSES', data, item}))
    .catch(err => console.log(err))
}

export const deleteExpenses = (token, id) => (dispatch) => {
  fetch('/api/item/' + id, {method: 'DELETE', headers: {'x-auth-token': token}})
    .then(res => res.json())
    .then(data => dispatch({type: 'DELETE_EXPENSES', data, id}))
    .catch(err => console.log(err))
}