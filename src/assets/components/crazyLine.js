import React from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import color from 'rcolor';
var createReactClass = require('create-react-class');
const initialState = {
  labels: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
  datasets: [
    {
		label: 'My First dataset',
		backgroundColor: 'rgba(255,99,132,0.2)',
		borderColor: 'rgba(255,99,132,1)',
		borderWidth: 1,
		hoverBackgroundColor: 'rgba(255,99,132,0.4)',
		hoverBorderColor: 'rgba(255,99,132,1)',
		data: [0, 0, 0, 0, 0, 0, 0,0,0,0,0,0]
    }
  ]
};
var id = "";

async function getData(){
	var turns = [];
	var host = 'etorn.localhost';
    var prefix = '';
	var storeTest = id;
	const url = host + prefix +'/store/'+storeTest+'/turns';
	await axios.get(url).then((res) => {
		turns =  res.data;

	});

	return turns;
}

var Graph = createReactClass({
	displayName: 'Graph',
	componentWillMount(){
		this.setState(initialState);
	},
	componentDidMount(){

		var _this = this;

		setInterval(function(){
			var oldDataSet = _this.state.datasets[0];
			var newData = [];

			/*for(var x=0; x< _this.state.labels.length; x++){
				newData.push(Math.floor(Math.random() * 100));
			}*/
			var newDataSet = {
				...oldDataSet
			};
			//newData = getData();
			//console.log(getData());
			newDataSet.data = newData;
			newDataSet.backgroundColor = color();
			newDataSet.borderColor = color();
			newDataSet.hoverBackgroundColor = color();
			newDataSet.hoverBorderColor = color();

			var newState = {
				...initialState,
				datasets: [newDataSet]
			};

			_this.setState(newState);
		}, 1000);
	},
	render() {
		return (
			<Bar data={this.state} />
		);
	}
});




export default createReactClass({
  displayName: 'Crazy Random Graph',

  render() {
  	id = this.props.nom;
    return (
      <div>
        <h2>You can even make crazy graphss!</h2>
 		<Graph/>
      </div>
    );
  }
});