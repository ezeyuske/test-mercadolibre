import React from 'react';
import { arrayOf, string } from 'prop-types';

import './Breadcrumb.scss';

const Breadcrumb = ({ categories }) => (
	<div className="breadcrumb">
		{categories.map(category => (
			<a
				key={category}
				href="#"
				className="breadcrumb__categorie"
			>
				{category}
			</a>
		))}
	</div>
);
Breadcrumb.propTypes = {
	categories: arrayOf(string)
};
Breadcrumb.defaultProps = {
	categories: []
};

export default Breadcrumb;
