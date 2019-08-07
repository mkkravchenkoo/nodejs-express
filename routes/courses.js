const {Router} = require('express');
const Courses = require('../models/courses');

const router = Router();

router.get('/', async (req, res) => {
	const courses = await Courses.find();
	res.render('courses', {
		title: 'All courses',
		courses
	})
})

router.get('/:id/edit', async (req, res) => {
	if(!req.query.allow){
		return res.redirect('/')
	}
	const course = await Courses.findById(req.params.id);
	res.render('course-edit', {
		title: course.title,
		course,
	})

});

router.get('/:id', async (req, res) => {
	const course = await Courses.findById(req.params.id);
	res.render('course', {
		layout:'empty',
		title: course.title,
		course,

	})
})

router.post('/edit', async (req, res) => {
	const {id} = req.body;
	delete req.body.id;

	await Courses.findByIdAndUpdate(id, req.body);
	res.redirect('/courses')
});


module.exports = router;