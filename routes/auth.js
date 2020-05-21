const express = require('express');
const router = express.Router();
const passport = require('passport');

const userDb = require('../Database/user');

router.get('/register', function(req, res, next)
{
    const user = req.user;
    if(req.user.loggedIn)
    {
        res.redirect('/');
    }
    else
    {
        userDb.findOne(user.GoogleId)
        .then(dbUser =>
            {
                if(dbUser && dbUser.userName)
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
    const user = req.user;
    if(!req.body.username)
    {
        res.redirect('/auth/register-cancel');
    }
    else
    {
        user.UserName = req.body.username;
        userDb.safeUpdate(
            req.user.GoogleId,
            user)
        .then(() =>
        {
            res.redirect('/');
        })
        .catch(err =>
        {
            console.log(err);
            res.redirect('/auth/register-cancel');
        });
    }
});

router.post('/register-cancel', function(req, res, next)
{
    const user = req.user;
    userDb.remove(user.GoogleId)
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