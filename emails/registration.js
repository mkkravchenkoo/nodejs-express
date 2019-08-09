const keys = require('../keys')

module.exports = function (email) {
	return {
		to:email,
		from: keys.EMAIL_FROM,
		subject:'Account was created',
		html:`
		<h1>Welcome!!!</h1>
		<p>You successfully created account!!!!</p>
		<hr/>
		<a href="${keys.BASE_URL}">${keys.BASE_URL}</a>
		`
	}
}