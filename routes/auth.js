const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
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


router.get('/reset', (req, res) => {
	res.render('auth/reset', {
		title:'Forgot password?',
		error:req.flash('error')
	})
})

router.get('/password/:token', async (req, res) => {

	
	
	if(!req.params.token){
		return res.redirect('/auth/login')
	}

	try {
		const user = await User.findOne({
			resetToken: req.params.token,
			resetTokenExp: {$gt: Date.now()}
		});

		if(!user){
			return res.redirect('/auth/login')
		}else{
			res.render('auth/password', {
				title:'Restoring password',
				error:req.flash('error'),
				userId:user._id.toString(),
				token:req.params.token
			})
		}

	}catch (e) {
		console.log(e)
	}

});

router.post('/reset', (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if(err){
				req.flash('error', 'Something was wrong!!!!')
				return res.redirect('/auth/reset')
			}

			const token = buffer.toString('hex')
			const candidate = await User.findOne({email: req.body.email});

			if(candidate){
				candidate.resetToken = token;
				candidate.resetTokenExp = Date.now() + 60*60*1000;

				await candidate.save();
				await transporter.sendMail(resetEmail(candidate.email, token))
				res.redirect('/auth/login')
			}else{
				req.flash('error', 'No user with this email')
				res.redirect('/auth/reset')
			}
		})
	}catch (e) {
		console.log(e)
	}
})

router.post('/password', async (req, res) => {
	try {

		const user = await User.findOne({
			_id:req.body.userId,
			resetToken: req.body.token,
			resetTokenExp:{$gt: Date.now()}
		})

		if(user){
			user.password = await bcrypt.hash(req.body.password, 10);
			user.resetToken = undefined;
			user.resetTokenExp = undefined
			await user.save();
			res.redirect('/auth/login')
		}else{
			req.flash('loginError', 'Token time is expired');
			res.redirect('/auth/login')
		}

	}catch (e) {
		console.log(e)
	}
})


module.exports = router