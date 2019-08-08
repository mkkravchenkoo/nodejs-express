const {Router} = require('express')
const User = require('../models/user')

const router = Router();

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Authentication'
	});
})


router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login')
	});

})

router.post('/login', async (req, res) => {
	const user =  await User.findById('5d4be3eededfb917f0094b69');
	req.session.user  = user
	req.session.isAuthenticated = true;
	req.session.save((err) => {
		if (err) throw err;

		res.redirect('/')
	})

})

module.exports = router