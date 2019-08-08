const {Router} = require('express');

const Courses = require('../models/courses')

function mapCartItems(cart) {
	return cart.items.map(c => {
		return {...c.courseId._doc, count:c.count}
	})
}

function computePrice(courses) {
	return courses.reduce((total, course) => {
		return total += course.price*course.count
	}, 0)
}


const router = Router();

router.post('/add', async (req, res) => {
	const course = await Courses.findById(req.body.id);
	await req.user.addToCart(course);
	res.redirect('/card')
});

router.get('/', async (req, res) => {

	const user = await req.user
					.populate('cart.items.courseId')
					.execPopulate();

	const courses = mapCartItems(user.cart)

	res.render('card', {
		title: 'Basket',
		courses: courses,
		price:computePrice(courses)
	})
});

router.delete('/remove/:id', async (req, res) => {
	const card = await Card.remove(req.params.id);
	res.status(200).json(card);
})


module.exports = router;


