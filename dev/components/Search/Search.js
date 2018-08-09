import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { getUrlParameter, cleanUrl, formatPrice } from 'utils';

import Breadcrumb from '../Breadcrumb/Breadcrumb';

import './Search.scss';

class Search extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			categories: [],
			items: []
		};

		this.handleSearch = this.handleSearch.bind(this);
	}

	componentDidMount() {
		const { history } = this.props;
		
		this.handleSearch();	

		history.listen(this.handleSearch)
	}

	handleSearch() {
		const search = getUrlParameter('search');
		const { history } = this.props;

		if(search && history.location.search) {
			axios(cleanUrl(`/api/items?q=​${search}`))
				.then(({ data }) => {
					const { categories, items } = data;
					this.setState({ categories, items });
				})
		}
	}

	render() {
		const { categories, items } = this.state;

		return (
			<div className="content-main search-results">
				<Breadcrumb categories={categories} />

				<div className="content-wrapper">
					{items.map(({ id, picture, title, free_shipping, price: { currency, amount, decimals }, state }) => (
						<div key={id} className="product">
							<Link to={`/items/${id}`}>
								<div className="product__image">
									<img src={picture} alt={title} />
								</div>
							</Link>
							<div className="product__data">
								<p className="product__price">
									{formatPrice(amount, currency, '.')}
									{decimals !== '00' && (
										<span className="product__price-decimals">
											{decimals}
										</span>
									)}
									{free_shipping && <span className="product__free-shipping" />}
									<span className="product__city">{state}</span>
								</p>
								<Link to={`/items/${id}`} className="product__name">
									{title}
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default withRouter(Search);
