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

module.exports = router;