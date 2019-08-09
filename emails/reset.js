const keys = require('../keys')

module.exports = function (email, token) {
	return {
		to:email,
		from: keys.EMAIL_FROM,
		subject:'Reset password',
		html:`
		<h1>Forgot password?</h1>
		<p>
			Click on link 	
			<a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a>
		</p>

		`
	}
}