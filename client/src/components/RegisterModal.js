import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { Alert, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input} from 'reactstrap';
import '../css/Register.css';

class RegisterModal extends React.Component {

  state = {
    modal: false,
    email: '',
    username: '',
    password: '',
    msg: null
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error)
      if (this.props.error.id === 'REGISTER_FAIL')
        this.setState({msg: this.props.error.msg});
      else
        this.setState({msg: null});

    if (this.state.modal)
      if (this.props.isAuth)
        this.toggle();
  }

  toggle = (e) => {
    e.preventDefault();
    this.props.clearErrors();
    this.setState({ modal: !this.state.modal })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
      const {email, username, password} = this.state;
      const newUser = {email, username, password};
      this.props.register(newUser);
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggle} block>Register</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className='modalHeader'>
            Register
          </ModalHeader>
          <ModalBody>
            {this.state.msg ? <Alert color='danger'>{this.state.msg}</Alert> : null}
            <Form>
              <FormGroup>
                <Label for='email'>Email:</Label>
                <Input type='email' name='email' id='email' placeholder='email' onChange={this.onChange} className='mb-3'/>
                <Label for='username'>Username:</Label>
                <Input type='text' name='username' id='username' placeholder='username' onChange={this.onChange} className='mb-3'/>
                <Label for='password'>Password:</Label>
                <Input type='password' name='password' id='password' placeholder='password' onChange={this.onChange} className='mb-3'/>
                <Button onClick={this.onSubmit}>Register</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

RegisterModal.protoTypes = {
  error: PropTypes.object.isRequired,
  isAuth: PropTypes.bool,
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isAuth: state.authReducer.isAuth,
  error: state.errorReducer
})

export default connect (mapStateToProps, { register, clearErrors })(RegisterModal);