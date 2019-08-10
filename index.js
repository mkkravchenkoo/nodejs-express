const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const path = require('path')
const scrf = require('csurf');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)

const varMiddleare = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorhandler = require('./middleware/error')


const keys = require('./keys')

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname:'hbs',
	helpers: require('./utils/hbs-helpers')
});

const store = new MongoStore({
	collection: 'sessions',
	uri:keys.MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: keys.SESSION_SECRET,
	resave:false,
	saveUninitialized:false,
	store:store
}));

app.use(scrf());
app.use(flash());

app.use(varMiddleare);
app.use(userMiddleware);

app.use('/',homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(errorhandler);


const PORT = process.env.PORT || 3000;

async function start(){

	try {
		await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false});

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})

	}catch (e) {
		console.log(e)
	}

}

start()




