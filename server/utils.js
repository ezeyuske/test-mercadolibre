const request = require('request');

const cleanUrl = url => encodeURI(url).replace(/%E2%80%8B/g, '');

const get = (url, headers = {}) => new Promise((resolve, reject) => {
	const uri = cleanUrl(url);
	request(uri, (err, res, body) => {
		try {
			if(err)
				reject(err);
			else if(body) {
				const data = JSON.parse(body);
				if(data.error)
					reject(data);
				else
					resolve(data);
			} else
				resolve(body);
		} catch(e) {
			reject(e);
		}
	})
});

const formatJson = (data) => ({
	author: {
		name: 'Ezequiel',
		lastname: 'Martinez'
	},
	...data
});

const currencyMap = {
	ARS: '$ ',
	USD: 'U$S '
};

const getTreeCategory = async function(id) {
	try {
		const categoryData = await get(`https://api.mercadolibre.com/categories/${id}`);
		if(categoryData) {
			const categories = categoryData.path_from_root.map(({ name }) => name);
			return categories;
		} else
			return [];
	} catch(e) {
		console.error('getTreeCategory: ', e);
		return [];
	}
};

const parseDataItem = (item, fullData = false, descriptionData) => {
	try {
		const {
			id,
			title,
			currency_id,
			price,
			thumbnail,
			pictures,
			attributes,
			shipping: { free_shipping },
			address,
			seller_address,
			sold_quantity
		} = item;

		const decimals = (price - Math.trunc(price)).toFixed(2).toString().split('.')[1];
		const condition = attributes.find(({ id }) => id === 'ITEM_CONDITION');

		const generalData = {
			id,
			title,
			price: {
				currency: currencyMap[currency_id] || '$ ',
				amount: Math.trunc(price),
				decimals
			},
			picture: thumbnail,
			condition: condition ? condition.value_name : '',
			free_shipping,
			state: !fullData ? address.state_name : seller_address.state.name
		};

		let extraData = {};

		if(fullData) {
			let picture = thumbnail;
			if(pictures.some(({ size }) => size === '500x500')) {
				const pictureData = pictures.find(({ size }) => size === '500x500');
				picture = pictureData.url;
			} else if(pictures.length) {
				picture = pictures[0].url;
			}

			const description = !descriptionData ? '' : descriptionData.plain_text.split('\n').map(text => `<p>${text}</p>`).join('<br />');

			extraData = Object.assign({}, extraData, {
				picture,
				sold_quantity,
				description
			});
		}

		return Object.assign({}, generalData, extraData);
	} catch(e) {
		console.log('e', e);
	}
};

module.exports = {
	cleanUrl,
	get,
	getTreeCategory,
	parseDataItem,
	formatJson
};
