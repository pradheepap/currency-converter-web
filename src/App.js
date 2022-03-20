import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';
import {
	ApolloClient,
	InMemoryCache,
	gql
  } from "@apollo/client";

function App() {

// Initializing all the state variables
const [info, setInfo] = useState([]);
const [input, setInput] = useState(0);
const [from, setFrom] = useState("USD");
const [to, setTo] = useState("SGD");
const [options, setOptions] = useState([]);
const [output, setOutput] = useState(0);

const EXCHANGE_RATES = `{  	
		listCurrencies
}`;

const CONVERT_CURRENCY = `{  	
	convertCurrency(from: "USD", to: "SGD", units: 30) {
		amount
		from
		output
		rate
	  }
}`;


const client = new ApolloClient({
	uri: `https://4im56e5pnjgpbmuqrzcxtgv2lm.appsync-api.ap-southeast-1.amazonaws.com/graphql`,
	cache: new InMemoryCache(),
	headers: {
		'x-api-key': `da2-praw6gf5bff7rojzikysxrg2gm`
	  }
  });

// Calling the api whenever the dependency changes
useEffect(() => {

	client
  .query({
    query: gql `${EXCHANGE_RATES}`
  })
  .then( (result) => {
	  console.log (JSON.parse(result.data.listCurrencies));
	  const currenciesList = JSON.parse(result.data.listCurrencies);
	  console.log ((currenciesList.rates));
	  setInfo(currenciesList.rates);
  });
// 	Axios.get(
// `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`)
// .then((res) => {
// //	setInfo(res.data[from]);
// 	console.log(res.data[from]);


	
	
// 	// Axios.post(`https://4im56e5pnjgpbmuqrzcxtgv2lm.appsync-api.ap-southeast-1.amazonaws.com/graphql`, query, { headers })
// 	// 	.then((response) => {
// 	// 		console.log(response);
// 	// 	})
// 	 }
// 	)
}, [from]);

// Calling the convert function whenever
// a user switches the currency
useEffect(() => {
	setOptions(Object.keys(info));
	convert();
}, [info])
	
// Function to convert the currency
function convert() {
	client
  .query({
    query: gql `${CONVERT_CURRENCY}`
  })
  .then( (result) => {
	  console.log (result.data.convertCurrency);
	  const convertCurrencyOutput = (result.data.convertCurrency);
	  console.log ((convertCurrencyOutput.output));
	  setOutput(convertCurrencyOutput.output);
  });
	
}

// Function to switch between two currency
function flip() {
	var temp = from;
	setFrom(to);
	setTo(temp);
}


return (
	<div className="App">
	<div className="heading">
		<h1>Currency converter</h1>
	</div>
	<div className="container">
		<div className="left">
		<h3>Amount</h3>
		<input type="text"
			placeholder="Enter the amount"
			onChange={(e) => setInput(e.target.value)} />
		</div>
		<div className="middle">
		<h3>From</h3>
		<Dropdown options={options}
					onChange={(e) => { setFrom(e.value) }}
		value={from} placeholder="From" />
		</div>
		<div className="switch">
		<HiSwitchHorizontal size="30px"
						onClick={() => { flip()}}/>
		</div>
		<div className="right">
		<h3>To</h3>
		<Dropdown options={options}
					onChange={(e) => {setTo(e.value)}}
		value={to} placeholder="To" />
		</div>
	</div>
	<div className="result">
		<button onClick={()=>{convert()}}>Convert</button>
		<h2>Converted Amount:</h2>
		<p>{input+" "+from+" = "+output.toFixed(2) + " " + to}</p>

	</div>
	</div>
);
}

export default App;
