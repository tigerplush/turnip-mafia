const express = require('express');
const router = express.Router();
const passport = require('passport');

const userDb = require('../Database/user');

router.get('/register', function(req, res, next)
{
    if(req.user.loggedIn)
    {
        res.redirect('/');
    }
    else
    {
        userDb.findOne({userId: req.user.sub})
        .then(user =>
            {
                if(user && user.userName)
                {
                    res.redirect('/');
                }
                else
                {
                    let data = {};
                    res.render('register.hbs', data);
                }
            })
        .catch(next);
    }
});

router.post('/register', function(req, res, next)
{
    res.redirect('/');
});

router.post('/register-cancel', function(req, res, next)
{
    console.log(req.user);
    userDb.remove({userId: req.user.userId})
    .catch(err => console.log(err));
    req.session.destroy();
    res.redirect('/');
});

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res)
        {
            res.redirect('/auth/register');
        }
);

module.exports = router;