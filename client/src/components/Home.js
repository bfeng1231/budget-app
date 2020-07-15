import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getExpenses } from '../actions/expensesActions';
import CanvasJSReact from '../assets/canvasjs.react';
import '../css/Home.css';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Home extends React.Component {

  state = {
    token: window.localStorage.getItem('token'),
    username: '',
    budget: ''
  }

  componentDidMount() {
    this.props.getExpenses(this.state.token);
    if (this.props.user)
      this.setState({username: this.props.user.username, budget: this.props.user.budget})
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.items !== prevProps.data.items)
      this.props.getExpenses(this.state.token);
    if (this.props.user !== prevProps.user) {
      if (this.props.user.username)
        this.setState({username: this.props.user.username, budget: this.props.user.budget})
    }
  }

  render() {
    let today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    const totals = [];

    for (let i = 0; i < 5; i++) {
      //get the month and the month's year
      let currentYear = today.getFullYear();
      let iterateMonth = today.getMonth() - i;
      //adjust for correct month and year when looking past January
      if (today.getMonth() - i <= -1) {
        iterateMonth += 12;
        currentYear -= 1
      }
      totals.push({
        label: months[iterateMonth],
        y: this.props.data.items.filter(elem => new Date(elem.date).getMonth() === iterateMonth && Number(elem.date.substr(0,4)) === currentYear).reduce((total, elem) => total + elem.cost, 0)
      })
    }

    const expensesBarChart = {
      theme: "light2",
			title: {
				text: "Total Expenses in the Past 5 Months"
      },
      axisX: {
        title: "Months",
        reversed: true
			},
			axisY: {
				title: "Dollars",
				labelFormatter: this.addSymbols
			},
			data: [
			{
        type: "column",
        toolTipContent: "<b>{label}</b>: ${y}",
				dataPoints: totals
			}
			]
    }
    
    const expensesPieChart = {
			exportEnabled: true,
      animationEnabled: true,
      theme: "dark2",
			title: {
				text: "Percentage of Total Expenses By Catagories"
			},
			data: [{
				type: "pie",
				startAngle: 90,
				toolTipContent: "<b>{label}</b>: {y}%",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - {y}%",
				dataPoints: [
					{ y: Math.round((this.props.data.items.filter(elem => elem.desc === 'Food').reduce((total, elem) => total + elem.cost, 0) / this.props.data.items.reduce((total, elem) => total + elem.cost, 0)) * 100), label: "Food" },
					{ y: Math.round((this.props.data.items.filter(elem => elem.desc === 'Entertainment').reduce((total, elem) => total + elem.cost, 0) / this.props.data.items.reduce((total, elem) => total + elem.cost, 0)) * 100), label: "Entertainment" },
					{ y: Math.round((this.props.data.items.filter(elem => elem.desc === 'Bills').reduce((total, elem) => total + elem.cost, 0) / this.props.data.items.reduce((total, elem) => total + elem.cost, 0)) * 100), label: "Bills" },
					{ y: Math.round((this.props.data.items.filter(elem => elem.desc === 'Clothing').reduce((total, elem) => total + elem.cost, 0) / this.props.data.items.reduce((total, elem) => total + elem.cost, 0)) * 100), label: "Clothing" },
					{ y: Math.round((this.props.data.items.filter(elem => elem.desc === 'Other').reduce((total, elem) => total + elem.cost, 0) / this.props.data.items.reduce((total, elem) => total + elem.cost, 0)) * 100), label: "Other" }
				]
			}]
    }
    
    const expensesSideBarChart = {
      animationEnabled: true,
			theme: "dark2",
			title:{
				text: "Total Expenses By Catagories"
			},
			axisX: {
				title: "Catagories",
				reversed: true,
			},
			axisY: {
				title: "Dollars",
				labelFormatter: this.addSymbols
			},
			data: [{
        type: "bar",
        toolTipContent: "<b>{label}</b>: ${y}",
				dataPoints: [
					{ y: this.props.data.items.filter(elem => elem.desc === 'Food').reduce((total, elem) => total + elem.cost, 0), label: "Food" },
					{ y: this.props.data.items.filter(elem => elem.desc === 'Entertainment').reduce((total, elem) => total + elem.cost, 0), label: "Entertainment" },
					{ y: this.props.data.items.filter(elem => elem.desc === 'Bills').reduce((total, elem) => total + elem.cost, 0), label: "Bills" },
					{ y: this.props.data.items.filter(elem => elem.desc === 'Clothing').reduce((total, elem) => total + elem.cost, 0), label: "Clothing" },
					{ y: this.props.data.items.filter(elem => elem.desc === 'Other').reduce((total, elem) => total + elem.cost, 0), label: "Other" }
				]
			}]
    }

    return (
      <div className='home'>
        <div>
          <h1>Welcome, {this.state.username}</h1>
          <h4>Today is {today.toDateString()}</h4>
        </div>
        <div>
          <h5>Your budget for this month is: ${this.state.budget}</h5>
        </div>
        <div className='charts'>
          <div className='lgChart'>
            <CanvasJSChart options={expensesBarChart}/>
          </div>
          <div>
            <CanvasJSChart options={expensesPieChart}/>
          </div>
          <div>
            <CanvasJSChart options={expensesSideBarChart}/>
          </div>
        </div>
      </div>
    )
  }
}

Home.protoTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getExpenses: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  data: state.expensesReducer,
  user: state.authReducer.user,
})

export default connect (mapStateToProps, { getExpenses })(Home);