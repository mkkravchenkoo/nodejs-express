const {Router} = require('express');
const Courses = require('../models/courses');
const auth  = require('../middleware/auth');

const router = Router();


function isOwner(course, req){
	return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
	try {
		const courses = await Courses.find()
			.populate('userId', 'email name')
			.select('img price title');

		res.render('courses', {
			title: 'All courses',
			courses,
			userId:req.user ? req.user._id.toString() : null
		})
	}catch (e) {
		console.log(e)
	}

})

router.get('/:id/edit', auth, async (req, res) => {
	if(!req.query.allow){
		return res.redirect('/')
	}

	try {

		const course = await Courses.findById(req.params.id);

		if(!isOwner(course, req)){
			return res.redirect('/courses')
		}

		res.render('course-edit', {
			title: course.title,
			course,
		})

	}catch (e) {
		console.log(e)
	}


});

router.get('/:id', auth, async (req, res) => {
	try {
		const course = await Courses.findById(req.params.id);
		res.render('course', {
			layout:'empty',
			title: course.title,
			course,

		})
	}catch (e) {
		console.log(e)
	}
})

router.post('/edit', auth, async (req, res) => {

	try {

		const {id} = req.body;
		delete req.body.id;

		const course = await Courses.findById(id)

		if(!isOwner(course, req)){
			return res.redirect('/courses')
		}

		Object.assign(course, req.body)
		await course.save();

		// await Courses.findByIdAndUpdate(id, req.body);
		res.redirect('/courses')

	}catch (e) {
		console.log(e)
	}


});


router.post('/remove', auth, async (req, res) => {

	try {
		await Courses.deleteOne({
			_id: req.body.id,
			userId: req.user._id
		});
		res.redirect('/courses')
	}catch (e) {
		console.log(e)
	}

});

module.exports = router;