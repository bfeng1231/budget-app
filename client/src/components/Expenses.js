import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getExpenses, postExpenses, deleteExpenses } from '../actions/expensesActions';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert, Row, Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/Expenses.css';
import { faTrashAlt, faPlus, faEdit, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

class Expenses extends React.Component {

  state = {
    modal: false,
    name: '',
    cost: '',
    desc: 'Food',
    date: '',
    deleteMode: false,
    seeAll: false,
    token: window.localStorage.getItem('token'),
    msg: ''
  }

  componentDidMount() {
    console.log('mounting', this.state.token);
    this.props.getExpenses(this.state.token);
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.items !== prevProps.data.items) {
      this.props.getExpenses(this.state.token);
    }
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal, deleteMode: false, msg: '' })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = () => {
    if (!this.state.name || !this.state.desc || !this.state.cost || !this.state.date)
      return this.setState({msg: 'Please enter all fields'})
    
    if (isNaN(this.state.cost))
      return this.setState({msg: 'Please enter a number'})

    if (Number(this.state.cost) < 0)
      return this.setState({msg: 'Please enter a positive amount'})

    let cost = this.state.cost
    if (cost.toString().indexOf('.') === -1)
      cost = cost + '.00'

    const newItem = {
      name: this.state.name,
      desc: this.state.desc,
      cost: Number(cost).toFixed(2),
      date: this.state.date,
      uid: uuidv4()
    }
    this.props.postExpenses(this.state.token, newItem)
    this.toggle()
  }

  mode = () => {
    this.setState({ deleteMode: !this.state.deleteMode })
  }

  seeAll = () => {
    this.setState({ seeAll: !this.state.seeAll })
  }

  delete = (e) => {
    console.log(e.target.id)
    this.props.deleteExpenses(this.state.token, e.target.id)
  }

  render() {
    const today = new Date()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let monthlyExpenses = [];

    for (let i = 0; i < 5; i++) {
      //get the month and the month's year
      let currentYear = today.getFullYear();
      let iterateMonth = today.getMonth() - i;
      //adjust for correct month and year when looking past January
      if (today.getMonth() - i <= -1) {
        iterateMonth += 12;
        currentYear -= 1
      }
      monthlyExpenses.push({
        name: months[iterateMonth],
        year: currentYear,
        expenses: [...this.props.data.items
          .filter(elem => new Date(elem.date).getMonth() === iterateMonth && Number(elem.date.substr(0,4)) === currentYear)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
        ]
      })
    }
    //console.log(monthlyExpenses)

    //.sort((a, b) => new Date(b.date) - new Date(a.date))

    let allExpenses = this.props.data.items
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(elem => (
      <tr key={elem._id}>
          <td>{elem.name}</td>
          <td>${elem.cost}</td>
          <td>{elem.desc}</td>
          <td>{elem.date.substr(0,10)}</td>
          {this.state.deleteMode ? <td><button onClick={this.delete} id={elem.uid}><FontAwesomeIcon icon={faTrashAlt}/> Delete</button></td> : null}
      </tr>
    ))

    let displayExpenses = monthlyExpenses.map(elem => (
      <div key={elem.name + elem.year} className='months mb-3'>
        <h4>{elem.name}</h4>
        {elem.expenses.length !== 0 ? 
        <table className='mb-3'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Catagory</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {elem.expenses.map(elem => (
              <tr key={elem._id}>
                <td>{elem.name}</td>
                <td>${elem.cost}</td>
                <td>{elem.desc}</td>
                <td>{elem.date.substr(0,10)}</td>
                {this.state.deleteMode ? <td><button onClick={this.delete} id={elem.uid}><FontAwesomeIcon icon={faTrashAlt}/> Delete</button></td> : null}
              </tr>
            ))}
          </tbody>
        </table> : <h6>No expenses for this month</h6>}
      </div>
    ))

    return (
      <div className='expenses'>
        <div>
          <h1>Expenses</h1>
        </div>
          {this.state.seeAll ? 
          <div>
            <table className='mb-3'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Catagory</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allExpenses}
              </tbody>
            </table>
          </div> : 
          <div>{displayExpenses}</div>}
        <div>
          <Button onClick={this.toggle} color='primary' className='mr-3'><FontAwesomeIcon icon={faPlus}/> Add Item</Button>
          <Button onClick={this.mode} color='warning' className='mr-3'><FontAwesomeIcon icon={faEdit}/> Edit Items</Button>
          {this.state.seeAll ?
          <Button onClick={this.seeAll} color='secondary'>Back</Button> :
          <Button onClick={this.seeAll} color='secondary'>See All</Button>}
        </div>
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle} className='modalHeader'>
              Add Item to Expenses
            </ModalHeader>
            <ModalBody>
              {this.state.msg ? <Alert color='danger'>{this.state.msg}</Alert> : null}
              <Form>
                <FormGroup>
                  <Label for='item'>Item Name:</Label>
                  <Input type='text' name='name' id='name' onChange={this.onChange} className='mb-3'/>
                  <Label for='cost'>Cost:</Label>
                  <Row>
                    <Col xs='auto' className='icon'>
                      <FontAwesomeIcon icon={faDollarSign}/>
                    </Col>
                    <Col>
                      <Input type='text' name='cost' id='cost' onChange={this.onChange} className='mb-3'/>
                    </Col>
                  </Row>
                  <Label for="desc">Catagory:</Label>
                  <Input type="select" name="desc" id="desc" onChange={this.onChange} className='mb-3'>
                    <option>Food</option>
                    <option>Entertainment</option>
                    <option>Bills</option>
                    <option>Clothing</option>
                    <option>Other</option>
                  </Input>
                  <Label for="date">Date:</Label>
                  <Input type="date" name="date" id="date" onChange={this.onChange} className='mb-3'/>           
                  <Button onClick={this.onSubmit}>Add Item</Button>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}

Expenses.protoTypes = {
  data: PropTypes.object.isRequired,
  getExpenses: PropTypes.func.isRequired,
  postExpenses: PropTypes.func.isRequired,
  deleteExpenses: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  data: state.expensesReducer
})

export default connect (mapStateToProps, { getExpenses, postExpenses, deleteExpenses })(Expenses);