import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { getUrlParameter } from 'utils';

import './InputSearch.scss';

class InputSearch extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: ''
		};

		this.change = this.change.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	componentDidMount() {
		this.updateValue();

		const { history } = this.props;
		history.listen(() => {
			this.updateValue();
		});
	}

	change(value) {
		this.setState({ value });
	}
	updateValue() {
		const search = getUrlParameter('search') || '';
		this.setState({ value: search });
	}

	render() {
		const { value } = this.state;
		const { history } = this.props;

		return (
			<div className="input-search">
				<input
					type="text"
					id="search"
					name="search"
					className="input-search__input"
					placeholder="Nunca dejes de buscar"
					value={value}
					onChange={({ target: { value } }) => this.change(value)}
					onKeyPress={({ which, keyCode }) => {
						if((which === 13 || keyCode === 13))
							history.push(`/items?search=${value}`)
					}}
				/>
				<button
					type="submit"
					className="input-search__submit"
					onClick={() => history.push(`/items?search=${value}`)}
				/>
			</div>
		);
	}
}


export default withRouter(InputSearch);
