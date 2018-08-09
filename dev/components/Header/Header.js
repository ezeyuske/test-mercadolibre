import React from 'react';
import { Link } from 'react-router-dom';

import InputSearch from '../InputSearch/InputSearch';

import './Header.scss';

const Header = () => (
	<header className="header">
		<div className="header__wrapper">
			<Link to="/" className="header__logo" />
			<InputSearch />
		</div>
	</header>
);

export default Header;
