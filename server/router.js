const express = require('express');
const path = require('path');

const {
	cleanUrl,
	get,
	asyncMiddleware,
	getTreeCategory,
	parseDataItem,
	formatJson
} = require('./utils');

const router = express.Router();


const globalRoute = async(req, res, next) => {
	res.sendFile(path.resolve(__dirname, '../public/index.html'));
};

router.get('/', globalRoute);
router.get('/items', globalRoute);
router.get('/items/:id', globalRoute);



// ************************** APIs ************************** 

router.get('/api/items', async(req, res) => {
	const { query: { q: query } } = req;

	try {
		const search = await get(`https://api.mercadolibre.com/sites/MLA/search?q=:${query}&limit=4`);

		let categories = [];
		let categoriesData = search.available_filters.find(({ id }) => id === 'category');
		if(categoriesData) {
			const maxCategory = categoriesData.values.reduce((acum, category) => (acum.results > category.results ? acum : category), { results: 0 });
			categories = await getTreeCategory(maxCategory.id);
		} else {
			categoriesData = search.filters.find(({ id }) => id === 'category');
			if(categoriesData)
				categories = categoriesData.values[0].path_from_root.map(({ name }) => name);
		}

		const items = search.results.map(item => parseDataItem(item));

		res.status(200).json(formatJson({ categories, items }));
	} catch(err) {
		console.log('err', err);
		res.status(400).json({ error: true, dataError: err });
	}
});

router.get('/api/items/:id', async(req, res) => {
	const { id } = req.params;

	try {
		const itemData = await get(`https://api.mercadolibre.com/items/${id}`);
		const itemDescription = await get(`https://api.mercadolibre.com/items/${id}/description`);

		const categories = await getTreeCategory(itemData.category_id);

		const item = parseDataItem(itemData, true, itemDescription);

		res.status(200).json(formatJson({ categories, item }));
	} catch(err) {
		console.log('err', err);
		res.status(400).json({ error: true, dataError: err });
	}
});


module.exports = router;
