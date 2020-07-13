import React from 'react';
import '../css/Settings.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeProfile, changeUsername, changeEmail, changePassword } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { Alert } from 'reactstrap';

class Settings extends React.Component {

  state = {
    token: window.localStorage.getItem('token'),
    profile: '',
    username: '',
    email: '',
    password: '',
    newPassword: '',
    msg: ''
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error)
      if (this.props.error.id === 'UPDATE_FAIL')
        this.setState({msg: this.props.error.msg});    
      else
        this.setState({msg: null});
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onClick = (e) => {
    this.props.clearErrors();
    switch (e.target.id) {
      case 'profile':
        this.props.changeProfile(this.state.token, this.state.profile);
        return this.setState({profile: ''})
      case 'username':
        this.props.changeUsername(this.state.token, this.state.username);
        return this.setState({username: ''})
      case 'email':
        this.props.changeEmail(this.state.token, this.state.email);
        return this.setState({email: ''})       
      case 'password':
        this.props.changePassword(this.state.token, this.state.password, this.state.newPassword);
        return this.setState({password: '', newPassword: ''})
      default:
        return
    }
  }

  render() {
    return (
      <div className='settings'>
        <div>
          <h1>Settings</h1>
        </div>
        <div className='mb-3'>
          {this.state.msg ? <Alert color='danger'>{this.state.msg}</Alert> : null}
          <h4>Change profile picture</h4>
          <input type='link' name='profile' id='profile' placeholder='Image link' onChange={this.onChange} className='mr-3'/>
          <button onClick={this.onClick} id='profile'>Submit</button>
        </div>
        <div className='mb-3'>
          <h4>Change username</h4>
          <input type='text' name='username' id='username' placeholder='New username' onChange={this.onChange} className='mr-3'/>
          <button onClick={this.onClick} id='username'>Submit</button>
        </div>
        <div className='mb-3'>
          <h4>Change email</h4>
          <input type='email' name='email' id='email' placeholder='New email' onChange={this.onChange} className='mr-3'/>
          <button onClick={this.onClick} id='email'>Submit</button>
        </div>
        <div className='mb-3'>
          <h4>Change password</h4>
          <label className='mr-1'>Current password:</label>
          <input type='password' name='password' id='password' placeholder='Current password' onChange={this.onChange} className='mr-3'/>
          <label className='mr-1'>New password:</label>
          <input type='password' name='newPassword' id='newPassword' placeholder='New password' onChange={this.onChange} className='mr-3'/>
          <button onClick={this.onClick} id='password'>Submit</button>
        </div>
      </div>
    )
  }
}

Settings.protoTypes = {
  clearErrors: PropTypes.func.isRequired,
  changeProfile: PropTypes.func.isRequired,
  changeUsername: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.errorReducer
})

export default connect (mapStateToProps, { clearErrors, changeProfile, changeUsername, changeEmail, changePassword })(Settings);