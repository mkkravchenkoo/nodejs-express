const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const path = require('path')
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname:'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
	try {
		const user =  await User.findById('5d4be3eededfb917f0094b69');
		req.user = user;
		next();
	}catch (e) {
		console.log(e)
	}

});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));

app.use('/',homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;

async function start(){
	const password = 'YHsu0AkVgFVHOXWv';
	const url = `mongodb+srv://kolya123:${password}@cluster0-3fjpw.mongodb.net/shop`

	try {
		await mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});

		const candidate = await User.findOne();

		if(!candidate){
			const user = new User({
				email: 'test@mail.ru',
				name:'Kolya',
				cart:{
					items:[]
				}
			});

			await user.save()
		}

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})

	}catch (e) {
		console.log(e)
	}

}

start()




