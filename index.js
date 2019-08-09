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
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)
const User = require('./models/user');

const varMiddleare = require('./middleware/variables')
const userMiddleware = require('./middleware/user')


const password = 'YHsu0AkVgFVHOXWv';
const MONGODB_URI = `mongodb+srv://kolya123:${password}@cluster0-3fjpw.mongodb.net/shop`

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname:'hbs'
});

const store = new MongoStore({
	collection: 'sessions',
	uri:MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// app.use(async (req, res, next) => {
// 	try {
// 		const user =  await User.findById('5d4be3eededfb917f0094b69');
// 		req.user = user;
// 		next();
// 	}catch (e) {
// 		console.log(e)
// 	}
//
// });


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: 'some secret value',
	resave:false,
	saveUninitialized:false,
	store:store
}));

app.use(varMiddleare);
app.use(userMiddleware);

app.use('/',homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;

async function start(){

	try {
		await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false});

		// const candidate = await User.findOne();
		//
		// if(!candidate){
		// 	const user = new User({
		// 		email: 'test@mail.ru',
		// 		name:'Kolya',
		// 		cart:{
		// 			items:[]
		// 		}
		// 	});
		//
		// 	await user.save()
		// }

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})

	}catch (e) {
		console.log(e)
	}

}

start()




