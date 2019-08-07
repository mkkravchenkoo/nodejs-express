const {Router} = require('express');
const Courses = require('../models/courses');

const router = Router();

router.get('/', async (req, res) => {
	const courses = await Courses.getAll();
	res.render('courses', {
		title: 'All courses',
		courses
	})
})

router.get('/:id', async (req, res) => {
	const course = await Courses.getById(req.params.id);
	res.render('course', {
		layout:'empty',
		title: course.title,
		course,

	})
})

module.exports = router;