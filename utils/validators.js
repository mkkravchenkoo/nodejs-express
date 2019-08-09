const {body} = require('express-validator/check')


exports.registerValidators = [
	body('email').isEmail().withMessage('Please enter right email!'),
	body('password', 'Password must be 6-56 symbols with alphanumeric').isLength({min:6, max:56}).isAlphanumeric(),
	body('confirm').custom((value, {req}) => {
		if(value !== req.body.password){
			throw new Error('Password doesn"t matched!')
		}
		return true
	}),
	body('name').isLength({min:3}).withMessage('Name must be more than 3 symbols')
]