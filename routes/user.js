const express = require('express');
const router = express.Router();

const userDb = require('../Database/user');

router.get('/:id', function(req, res, next)
{
    const userId = req.params.id;
    userDb.findOne({_id: userId})
    .then(user =>
        {
            if(user)
            {
                res.render('user.hbs', user);
            }
            else
            {
                throw new Error('404');
            }
        })
    .catch(err =>
        {
            res.render('user404.hbs', {});
        });
});

module.exports = router;