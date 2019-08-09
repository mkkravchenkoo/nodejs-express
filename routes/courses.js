const {Router} = require('express');
const Courses = require('../models/courses');
const auth  = require('../middleware/auth');

const router = Router();

router.get('/', async (req, res) => {
	const courses = await Courses.find()
		.populate('userId', 'email name')
		.select('img price title');

	res.render('courses', {
		title: 'All courses',
		courses
	})
})

router.get('/:id/edit', auth, async (req, res) => {
	if(!req.query.allow){
		return res.redirect('/')
	}
	const course = await Courses.findById(req.params.id);
	res.render('course-edit', {
		title: course.title,
		course,
	})

});

router.get('/:id', auth, async (req, res) => {
	const course = await Courses.findById(req.params.id);
	res.render('course', {
		layout:'empty',
		title: course.title,
		course,

	})
})

router.post('/edit', auth, async (req, res) => {
	const {id} = req.body;
	delete req.body.id;

	await Courses.findByIdAndUpdate(id, req.body);
	res.redirect('/courses')
});


router.post('/remove', auth, async (req, res) => {

	try {
		await Courses.deleteOne({ _id: req.body.id });
		res.redirect('/courses')
	}catch (e) {
		console.log(e)
	}

});

module.exports = router;