const {Router} = require('express');
const {validationResult} = require('express-validator/check')
const Course = require('../models/courses');
const auth  = require('../middleware/auth');
const {courseValidators} = require('../utils/validators')
const router = Router();

router.get('/',  auth, (req, res) => {
	res.render('add', {
		title: 'Add new course'
	})
});

router.post('/', auth, courseValidators, async (req, res) => {

	const errors = validationResult(req);

	if(!errors.isEmpty()){
		return res.status(422).render('add', {
			title: 'Add new course',
			error:errors.array()[0].msg,
			data:{
				title: req.body.title,
				price: req.body.price,
				img: req.body.img,
			}
		})
	}

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