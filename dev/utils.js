export const getUrlParameter = (name) => {
	const tag = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	const regex = new RegExp('[\\?&]' + tag + '=([^&#]*)');
	const results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const cleanUrl = url => encodeURI(url).replace(/%E2%80%8B/g, '');

export const formatPrice = (number, currency, thousands) => {
	const re = `\\d(?=(\\d{3})+$)`;
	const regex = new RegExp(re, 'g');
	let newNumber = (number * 1).toFixed().toString(); // eslint-disable-line

	newNumber = newNumber.replace(regex, `$&${thousands || '.'}`);

	return currency + newNumber;
};
