const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');

const processRoutes = require('./routes/process');
const authRoutes = require('./routes/auth');

const app = express();

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: "dma_secret_key",
    resave: false,
    saveUninitialized: true
}));

// Handlebars helpers
hbs.registerHelper('inc', value => parseInt(value)+1);
hbs.registerHelper('includes', (array, value) => array && array.includes(value.toString()));
hbs.registerHelper('eq', (a,b) => a === b);

// Authentication middleware
function isAuthenticated(req,res,next){
    if(req.session && req.session.user) return next();
    res.redirect('/login');
}

// Redirect root
app.get('/', (req,res) => {
    if(req.session && req.session.user){
        res.redirect('/p'); // logged in → process timeline
    } else {
        res.redirect('/login'); // not logged in → login page
    }
});

// Routes
app.use('/', authRoutes);          // login/logout
app.use('/p', isAuthenticated, processRoutes); // all process routes under /p

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
