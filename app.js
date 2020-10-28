//! important delete before push :
//! app.js
//! authController.js
//! authMiddleware.js

//require
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const cookieParser = require('cookie-parser');
const {
    requireAuth,
    checkUser
} = require('./middleware/authMiddleware');

//MongoDB
const MongoClient = require('mongodb').MongoClient;

//express app
const app = express();

//register view engines
app.set('view engine', 'ejs');

//Connect to MongoDB
//! delete line with db before push
const dbURI = "mongodb+srv://tester:patate@clusterfreshshop.smrlx.mongodb.net/dbtest?retryWrites=true&w=majority";
mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err))

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

//routes to pages
app.get('*', checkUser);
app.use(indexRoutes);
app.use(authRoutes);
app.use(newsletterRoutes);

app.get('/about', (req, res) => {

    res.render('about');
});

app.get('/signup', (req, res) => {

    res.render('signup');
});

app.get('/login', (req, res) => {

    res.render('login');
});

app.get('/my-account', requireAuth, (req, res) => {

    res.render('my-account');
});

//404 //! Must be last route 
app.use((req, res) => {
    res.status(404).render('404');
});