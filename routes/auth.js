const {Router} = require('express')


const router = Router();

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Authentication'
	});
})

module.exports = router