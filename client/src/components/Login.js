import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import RegisterModal from './RegisterModal';
import '../css/Login.css';

class Login extends React.Component {

  state = {
    email: '',
    password: '',
    msg: null
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error)
      if (this.props.error.id === 'LOGIN_FAIL')
        this.setState({msg: this.props.error.msg});    
      else
        this.setState({msg: null});

  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    const {email, password} = this.state;
    const loginUser = {email, password};
    this.props.login(loginUser);
  }

  render() {
    return (
      <div className='loginPanel'>
        <img src='https://bit.ly/38ITsPk' alt='PFT - Personal Fianance Tracker'/>
        <div className='alert'>
          {this.state.msg ? <Alert color='danger'>{this.state.msg}</Alert> : null}
        </div>
          <Form>
            <FormGroup>
              <Label for='email'>Email:</Label>
              <Input type='email' name='email' id='email' placeholder='email' onChange={this.onChange} className='mb-3'/>
              <Label for='password'>Password:</Label>
              <Input type='password' name='password' id='password' placeholder='password' onChange={this.onChange} className='mb-5'/>          
              <div className='buttons'>
              <Button onClick={this.onSubmit} className='buttons' block>Login</Button>
              <RegisterModal />
              </div>
            </FormGroup>
          </Form>
        
      </div>
    )
  }
}

Login.protoTypes = {
  error: PropTypes.object.isRequired,
  isAuth: PropTypes.bool,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  error: state.errorReducer
})

export default connect (mapStateToProps, { login, clearErrors })(Login);