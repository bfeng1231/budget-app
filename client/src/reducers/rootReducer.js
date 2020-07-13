import { combineReducers } from 'redux';
import expensesReducer from './expensesReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  expensesReducer, authReducer, errorReducer
})