import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header/Header';

import Home from './components/Home/Home';
import Search from './components/Search/Search';
import ProductDetails from './components/ProductDetails/ProductDetails';

import './styles/global.scss';

const App = () => (
	<div className="app">
		<Router>
			<div>
				<Header />

				<Route exact path="/" component={Home} />
				<Route exact path="/items" component={Search} />
				<Route path="/items/:id" component={ProductDetails} />
			</div>
		</Router>
	</div>
);

export default App;
