import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import uuid from 'react-uuid';
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
const [user, setUser] = useState("");
const [count, setCount] = useState("");
const [usdvalue, setUsdValue] = useState("");


const EXCHANGE_RATES = `{  	
		listCurrencies
}`;


const client = new ApolloClient({
	uri: `https://4im56e5pnjgpbmuqrzcxtgv2lm.appsync-api.ap-southeast-1.amazonaws.com/graphql`,
	cache: new InMemoryCache(),
	headers: {
		'x-api-key': `da2-praw6gf5bff7rojzikysxrg2gm`,
	  }
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
    }else{
		const userName = `User_` + uuid();
		setUser(userName);
		localStorage.setItem("user", userName);
	}
  }, []);

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

}, [from]);

// Updating the currency list
useEffect(() => {
	setOptions(Object.keys(info));
	//convert();
}, [info]);

	
// Function to convert the currency
function convert() { 
	const CONVERT_CURRENCY = `{  	
		convertCurrency(from: "${from}", to: "${to}" , units: ${input}, user: "${user}") {
			amount
			from
			output
			rate
		  }
	}`;
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


// Function to get Count
function getCount() { 
	const TRANSACTIONS_COUNT = `{  	
		getTransactionsCount
	}`;
	client
  .query({
    query: gql `${TRANSACTIONS_COUNT}`
  })
  .then( (result) => {
	  console.log (result.data.getTransactionsCount);
	  const getTransactionsCount = (result.data.getTransactionsCount);
	  console.log ((getTransactionsCount));
	  setCount(getTransactionsCount);
  });	
}

// Function to get TotalValue in USD
function getTotalValueInUsd() { 
	const TRANSACTIONS_TOTAL_VALUE_IN_USD = `{  	
		getValueInUSD
	}`;
	client
  .query({
    query: gql `${TRANSACTIONS_TOTAL_VALUE_IN_USD}`
  })
  .then( (result) => {
	  console.log (result.data.getValueInUSD);
	  const getValueInUSD = (result.data.getValueInUSD);
	  console.log ((getValueInUSD));
	  setUsdValue(getValueInUSD);
  });	
}



return (
	<div className="App">
	<div className="heading">
		<h1>Currency converter</h1>
	</div>
	<div className="userInfo">
		<h1>Welcome {user} </h1>
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
		{/* <div className="switch">
		<HiSwitchHorizontal size="30px"
						onClick={() => { flip()}}/>
		</div> */}
		<div className="right">
		<h3>To</h3>
		<Dropdown options={options}
					onChange={(e) => {setTo(e.value)}}
		value={to} placeholder="To" />
		</div>
	</div>
	<br/>
	<div className="result">
		<button onClick={()=>{convert()}}>Convert</button>
		<h2>Converted Amount:</h2>
		<p>{input+" "+from+" = "+output.toFixed(2) + " " + to}</p>
	</div>
	<div className="count">
		<button onClick={()=>{getCount()}}>Count</button>
		<h2>Number of Transactions</h2>
		<p>{ " Count : "+ count}</p>
	</div>
	<div className="totalvalue">
		<button onClick={()=>{getTotalValueInUsd()}}>Total</button>
		<h2>Total Value in USD</h2>
		<p>{usdvalue}</p>
	</div>
	</div>
);
}

export default App;
