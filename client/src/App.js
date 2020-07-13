import React from 'react';
import './css/App.css';
import { Route, Switch, Redirect } from "react-router";
import Sidebar from './components/Sidebar';
import Expenses from './components/Expenses';
import Budget from './components/Budget';
import Settings from './components/Settings';
import Home from './components/Home';
import Login from './components/Login';
import { getUser } from './actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class App extends React.Component {

  componentDidMount() {
    this.props.getUser();
  }

  render() {
    console.log(this.props.isAuth)
    return (
      <div className="App">
        <Route exact path='/'>
          <div className='login'>
          <Login />
          {this.props.isAuth ? <Redirect to="/profile" /> : <Redirect to="/" />}
          </div>
        </Route>
        <Route path='/profile'>
          {this.props.isAuth ? <Redirect to="/profile" /> : <Redirect to="/" />}
          <div className="profile">
            <div className='sidebar'>
              <Sidebar />
            </div>
            <div className='mainPage'>
              <Switch>
                <Route path='/profile/expenses'>
                  <Expenses />
                </Route>
                <Route path='/profile/budget'>
                  <Budget />
                </Route>
                <Route path='/profile/settings'>
                  <Settings />
                </Route>
                <Route path='/profile'>
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </Route>

      </div>
    );
  }
}

App.protoTypes = {
  isAuth: PropTypes.bool,
  getUser: PropTypes.func.isRequired
}


const mapStateToProps = state => ({
  isAuth: state.authReducer.isAuth
})

export default connect (mapStateToProps, { getUser })(App);