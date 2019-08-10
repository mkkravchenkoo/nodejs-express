const {body} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
	body('email').isEmail().withMessage('Please enter right email!').custom(async (value, {req}) => {
		try {
			const user = await User.findOne({
				email: value
			});

			if(user){
				return Promise.reject('This email is already EXIST!')
			}
		}catch (e) {
			console.log(e)
		}
	}),
	body('password', 'Password must be 6-56 symbols with alphanumeric').isLength({min:6, max:56}).isAlphanumeric(),
	body('confirm').custom((value, {req}) => {
		if(value !== req.body.password){
			throw new Error('Password doesn"t matched!')
		}
		return true
	}),
	body('name').isLength({min:3}).withMessage('Name must be more than 3 symbols')
]