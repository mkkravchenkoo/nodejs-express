const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const regEmail = require('../emails/registration')

const User = require('../models/user')

const router = Router();


const transporter = nodemailer.createTransport(sendgrid({
	auth:{
		api_key:keys.SEND_GRID_API_KEY
	}
}))

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Authentication',
		registerError:req.flash('registerError'),
		loginError:req.flash('loginError')
	});
})


router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login')
	});

})

router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;
		const candidate = await User.findOne({email})

		if(candidate){
			const areSame = await bcrypt.compare(password, candidate.password)
			if(areSame){

				req.session.user  = candidate
				req.session.isAuthenticated = true;
				req.session.save((err) => {
					if (err) throw err;

					res.redirect('/')
				})

			}else{
				req.flash('loginError', 'Wrong password!!!')
				res.redirect('/auth/login')
			}
		}else{
			req.flash('loginError', 'Wrong login or password!!!!')
			res.redirect('/auth/login')
		}

	}catch (e) {
		console.log(e)
	}


})

router.post('/register', async (req, res) => {
	try {
		const {email, name, password, repeat} = req.body;


		const candidate = await User.findOne({email});

		if(candidate){
			req.flash('registerError', 'User is already exist!');
			res.redirect('/auth/login#register')
		}else{
			const hashPassword = await bcrypt.hash(password, 10)
			const user =  new User({
				email, name, password: hashPassword, cart:{items:[]}
			})
			await user.save();
			res.redirect('/auth/login#login')
			await transporter.sendMail(regEmail(email));
		}

	}catch (e) {
		console.log(e)
	}
})

module.exports = router