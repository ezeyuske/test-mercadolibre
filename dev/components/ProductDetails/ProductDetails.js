import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { cleanUrl, formatPrice } from 'utils';


import Breadcrumb from '../Breadcrumb/Breadcrumb';

import './ProductDetails.scss';

class ProductDetails extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			haveData: false,
			categories: [],
			item: {
				price: {}
			}
		};
	}

	componentDidMount() {
		const { match: { params: { id } } } = this.props;

		if(id) {
			axios(cleanUrl(`/api/items/​${id}`))
				.then(({ data }) => {
					const { categories, item } = data;
					this.setState({
						categories,
						item,
						loading: false,
						haveData: true
					});
				})
		}
	}

	render() {
		const {
			categories,
			haveData,
			item: {
				title,
				price: {
					currency,
					amount,
					decimals
				},
				condition,
				free_shipping,
				state,
				picture,
				sold_quantity,
				description
			}
		} = this.state;

		if(!haveData) {
			return (
				<div className="content-main product-details" />
			);
		}

		return (
			<div className="content-main product-details">
				<Breadcrumb categories={categories} />

				<div className="content-wrapper">
					<div className="product-details__top">
						<div className="product-details__image">
							<img src={picture} alt={title} />
						</div>
						<div className="product-details__data">
							<p className="product-details__states">
								<span className="product-details__state-condition">
									{condition}
								</span>
								{' - '}
								<span className="product-details__state-products-sold">
									{`${sold_quantity} vendido${sold_quantity !== 1 ? 's' : ''}`}
								</span>
							</p>
							<div className="product-details__name">
								{title}
							</div>
							<div className="product-details__price">
								{formatPrice(amount, currency, '.')}
								{decimals !== '00' && (
									<span className="product-details__price-decimals">
										{decimals}
									</span>
								)}
							</div>
							<button
								type="button"
								className="product-details__buy"
							>
								{'Comprar'}
							</button>
						</div>
					</div>
					<div className="product-details__bottom">
						<div className="product-details__description-title">
							{'Descripción del producto'}
						</div>
						<div
							className="product-details__description-content"
							dangerouslySetInnerHTML={{__html: description}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default ProductDetails;
