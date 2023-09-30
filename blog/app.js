require('dotenv').config();

const express = require ('express');
const expressLayout = require ('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const session = require('express-session');
const {isActivateRoute} = require('./server/helpers/routeHelpers')


const app = express();
const PORT = 5000 || process.env.PORT;
 
//connect db
connectDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }), 

}))
app.use(methodOverride('_method'))
//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActivateRoute = isActivateRoute;


app.use('/', require('./server/routes/main')); 
app.use('/', require('./server/routes/admin')); 

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})