require('dotenv').config();

const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const lessMiddleware = require('less-middleware');

const userDb = require('./Database/user');

//Routers
const overviewRouter = require('./routes/overview');
const usercpRouter = require('./routes/usercp');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const User = require('./User');

const app = express();

app.use(lessMiddleware('/less', {
    dest: '/stylesheets',
    pathRoot: __dirname + '/public'
}));

app.use(session(
    {
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: true
    })
);

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

/**
 * pass through session and user information
 */
app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL
    },
    function(accessToken, refreshToken, profile, done) {
        const userInfo = profile._json;
        let user = new User(userInfo.sub);
        userDb.findOne(user.GoogleId)
        .then(doc =>
            {
                if(doc)
                {
                    user = new User().FromObject(doc);
                    done(null, user);
                }
                else
                {
                    return userDb.insert(user.ToObject())
                    .then(newDoc =>
                        {
                            done(null, user);
                        });
                }
            })
        .catch(err => done(err, null));
        //return done(null, userInfo);
    }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user.ToObject());
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    userDb.findOne({googleId: user.googleId})
    .then(userDbEntry =>
        {
            var userClass = new User().FromObject(userDbEntry);
            done(null, userClass);
        })
    .catch(err => done(err, null));
});

const handlebars = hbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layout/',
});

handlebars.handlebars.registerHelper('json', function (content) {
    return new handlebars.handlebars.SafeString(JSON.stringify(content));
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res, next)
{
    res.redirect('/overview');
});

app.use('/auth', authRouter);

app.use('/overview', overviewRouter);

app.get('/openIslands', function(req, res, next)
{
    res.render('open-islands.hbs', {openIslands: true});
});

app.use('/usercp', usercpRouter);

app.use('/user', userRouter);

app.get('/login', function(req, res, next)
{
    res.redirect('/');
});

app.get('/logout', function(req, res, next)
{
    req.session.destroy();
    res.redirect('/');
})

app.listen(process.env.PORT);