const {Router} = require('express');
const Course = require('../models/courses');
const auth  = require('../middleware/auth');
const router = Router();

router.get('/',  auth, (req, res) => {
	res.render('add', {
		title: 'Add new course'
	})
});

router.post('/', auth, async (req, res) => {

	const course = new Course({
		title: req.body.title,
		price: req.body.price,
		img: req.body.img,
		userId:req.user._id
	});
	try {
		await course.save();
		res.redirect('/courses')
	}catch (e) {
		console.log(e)
	}
})

module.exports = router;