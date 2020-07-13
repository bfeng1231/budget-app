import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getExpenses } from '../actions/expensesActions';
import { changeBudget } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { NavLink } from 'react-router-dom';
import CanvasJSReact from '../assets/canvasjs.react';
import '../css/Budget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Alert, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input} from 'reactstrap';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Budget extends React.Component {

  state = {
    budget: '',
    modal: false,
    token: window.localStorage.getItem('token'),
    input: '',
    msg: ''
  }

  componentDidMount() {
    this.props.getExpenses(this.state.token);
    if (this.props.user)
        this.setState({budget : this.props.user.budget})
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.items !== prevProps.data.items)
      this.props.getExpenses(this.state.token);
    if (this.props.user !== prevProps.user)
        this.setState({budget : this.props.user.budget})
    if (this.props.error !== prevProps.error)
      if (this.props.error.id === 'UPDATE_FAIL')
        this.setState({msg: this.props.error.msg});    
      else
        this.setState({msg: null});
  }

  toggle = () => {
    this.props.clearErrors();
    this.setState({ modal: !this.state.modal })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = () => {
    if (this.state.input < 0)
      return this.setState({msg: 'Please enter a positive number'})
    if (isNaN(this.state.input) || !this.state.input)
      return this.setState({msg: 'Please enter a number'})
    this.props.changeBudget(this.state.token, Number(this.state.input));
    this.setState({ budget: Number(this.state.input)});
    this.toggle();
  }

  render() {
    const today = new Date()
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let monthExpenses = this.props.data.items.filter(elem => elem.date.substr(0,7) === today.toISOString().substr(0,7))
   
    let itemList = monthExpenses.map(elem => (
      <tr key={elem._id}>
          <td>{elem.name}</td>
          <td>${elem.cost}</td>
          <td>{elem.desc}</td>
          <td>{elem.date.substr(0,10)}</td>
      </tr>
    ))

    let totalExpenses = monthExpenses.reduce((total, elem) => total + elem.cost, 0).toFixed(2);

    const budgetPieChart = {
			exportEnabled: true,
      animationEnabled: true,
      theme: "dark2",
			title: {
				text: "Percentage of Expenses By Catagories"
			},
			data: [{
				type: "pie",
				startAngle: 90,
				toolTipContent: "<b>{label}</b>: {y}%",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: [
					{ y: (monthExpenses.filter(elem => elem.desc === 'Food').reduce((total, elem) => total + elem.cost, 0) / monthExpenses.reduce((total, elem) => total + elem.cost, 0)) * 100, label: "Food" },
					{ y: (monthExpenses.filter(elem => elem.desc === 'Entertainment').reduce((total, elem) => total + elem.cost, 0) / monthExpenses.reduce((total, elem) => total + elem.cost, 0)) * 100, label: "Entertainment" },
					{ y: (monthExpenses.filter(elem => elem.desc === 'Bills').reduce((total, elem) => total + elem.cost, 0) / monthExpenses.reduce((total, elem) => total + elem.cost, 0)) * 100, label: "Bills" },
					{ y: (monthExpenses.filter(elem => elem.desc === 'Clothing').reduce((total, elem) => total + elem.cost, 0) / monthExpenses.reduce((total, elem) => total + elem.cost, 0)) * 100, label: "Clothing" },
					{ y: (monthExpenses.filter(elem => elem.desc === 'Other').reduce((total, elem) => total + elem.cost, 0) / monthExpenses.reduce((total, elem) => total + elem.cost, 0)) * 100, label: "Other" }
				]
			}]
    }
    
    const budgetBarChart = {
      animationEnabled: true,
			theme: "dark2",
			title:{
				text: "This Month's Expenses By Catagories"
			},
			axisX: {
        title: "Catagories",
        reversed: true
			},
			axisY: {
				title: "Dollars",
				labelFormatter: this.addSymbols
			},
			data: [{
        type: "column",
        toolTipContent: "<b>{label}</b>: ${y}",
				dataPoints: [
					{ y: monthExpenses.filter(elem => elem.desc === 'Food').reduce((total, elem) => total + elem.cost, 0), label: "Food" },
					{ y: monthExpenses.filter(elem => elem.desc === 'Entertainment').reduce((total, elem) => total + elem.cost, 0), label: "Entertainment" },
					{ y: monthExpenses.filter(elem => elem.desc === 'Bills').reduce((total, elem) => total + elem.cost, 0), label: "Bills" },
					{ y: monthExpenses.filter(elem => elem.desc === 'Clothing').reduce((total, elem) => total + elem.cost, 0), label: "Clothing" },
					{ y: monthExpenses.filter(elem => elem.desc === 'Other').reduce((total, elem) => total + elem.cost, 0), label: "Other" }
				]
			}]
    }

    return (
      <div className='budget'>
        <div>
          <h1>Budget</h1>
        </div>
        <div>
          <div className='mb-3'>
            <h4>This month's budget: ${this.state.budget}</h4>
            <Button onClick={this.toggle} color='primary'>Change Budget</Button>
          </div>
          <div>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle} className='modalHeader'>
                Change budget
              </ModalHeader>
              <ModalBody>
                {this.state.msg ? <Alert color='danger'>{this.state.msg}</Alert> : null}          
                <Form>
                  <FormGroup>
                    <Label for='budget'>Amount:</Label>
                    <Input type='text' name='input' id='input' onChange={this.onChange} className='mb-3'/>   
                    <Button onClick={this.onSubmit}>Submit</Button>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div>
          <h3>{months[today.getMonth()]}</h3>
          {monthExpenses.length !== 0 ?
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
              {itemList}
            </tbody>
          </table> : <h6>You have no expenses this month</h6>}
          <h4>Total expenses for this month: ${totalExpenses}</h4>
          <h4>Remaining budget: ${(this.state.budget - totalExpenses).toFixed(2)}</h4>
        </div>
        <div className='mb-3'>
          <NavLink to='/profile/expenses' activeClassName=''>
            <Button color='warning'><FontAwesomeIcon icon={faEdit}/> Edit Expenses</Button>
          </NavLink>
        </div>
        <div className='charts'>
          <div>
            <CanvasJSChart options={budgetPieChart}/>
          </div>
          <div>
            <CanvasJSChart options={budgetBarChart}/>
          </div> 
        </div>
      </div>
    )
  }
}

Budget.protoTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  getExpenses: PropTypes.func.isRequired,
  changeBudget: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  data: state.expensesReducer,
  user: state.authReducer.user,
  error: state.errorReducer
})

export default connect (mapStateToProps, { clearErrors, getExpenses, changeBudget })(Budget);