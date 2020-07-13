import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../css/Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDollarSign, faScroll, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { getUser, logout } from '../actions/authActions';
import { Button } from 'reactstrap';

class Sidebar extends React.Component {

  state = {
    username: '',
    profile: ''
  }

  componentDidMount() {
    if (this.props.user)
      this.setState({username: this.props.user.username, profile: this.props.user.profile})
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user)
      this.setState({username: this.props.user.username, profile: this.props.user.profile})
  }

  onClick = () => {
    this.props.logout();
  }

  render() {
    return (
      <div className='sideBar'>
        <div className='userInfo'>
          <img src={this.state.profile} alt='Profile-Avatar' width="100" height="100"/>
          <h2>{this.state.username}</h2>
          <NavLink to='/'>
            <Button onClick={this.onClick} color='danger'><FontAwesomeIcon icon={faSignOutAlt}/> Logout</Button>
          </NavLink>
        </div>
        <div className='navigation'>
          <div>
            <NavLink exact to='/profile' activeClassName='buttonActive'>
              <button><FontAwesomeIcon icon={faHome}/> Home</button>
            </NavLink>
            <NavLink to='/profile/expenses' activeClassName=''>
              <button><FontAwesomeIcon icon={faScroll}/> Expenses</button>
            </NavLink>
            <NavLink to='/profile/budget' activeClassName=''>
              <button><FontAwesomeIcon icon={faDollarSign}/> Budget</button>
            </NavLink>
            <NavLink to='/profile/settings' activeClassName=''>
              <button><FontAwesomeIcon icon={faCog}/> Settings</button>
            </NavLink>  
          </div>
        </div>
      </div>
    )
  }
}

Sidebar.protoTypes = {
  logout: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.authReducer.user
})

export default connect (mapStateToProps, { getUser, logout })(Sidebar);