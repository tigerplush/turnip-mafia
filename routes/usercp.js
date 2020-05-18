const express = require('express');
const router = express.Router();

const moment = require('moment');

const turnipPrices = require('../Database/turnip-prices');

router.get('/', function(req, res, next)
{
    if(!req.user)
    {
        res.redirect('/');
    }
    else
    {
        const thisWeek = moment().weekYear() + "-W" + moment().week();

        if(req.query.week)
        {
            req.session.week = req.query.week;
        }
        if(!req.session.week)
        {
            req.session.week = thisWeek;
        }

        let user = {};
        turnipPrices.find(
            {
                userId: req.user.sub,
                week: req.session.week,
            })
        .then(docs =>
            {
                if(docs && docs.length > 0)
                {
                    user = docs[0];
                }
            })
        .catch(err => console.log(err))
        .finally(()=>
        {
            res.render('usercp.hbs',
            {
                usercp: true,
                defaultWeek: req.session.week,
                thisWeek: thisWeek,
                user: user,
            });
        });
    }
});

router.post('/', function(req, res, next)
{
    const turnipToUpdate = {};
    turnipToUpdate.userId = req.user.sub;
    turnipToUpdate.week = req.session.week;

    const turnip = {};
    turnip.userId = req.user.sub;
    turnip.userName = req.session.userName;
    turnip.week = req.session.week;
    turnip.buyingPrice = req.body.buyingPrice;
    turnip.monAM = req.body.monAM;
    turnip.monPM = req.body.monPM;
    turnip.tueAM = req.body.tueAM;
    turnip.tuePM = req.body.tuePM;
    turnip.wedAM = req.body.wedAM;
    turnip.wedPM = req.body.wedPM;
    turnip.thuAM = req.body.thuAM;
    turnip.thuPM = req.body.thuPM;
    turnip.friAM = req.body.friAM;
    turnip.friPM = req.body.friPM;
    turnip.satAM = req.body.satAM;
    turnip.satPM = req.body.satPM;

    turnipPrices.addOrUpdate(turnipToUpdate, turnip)
    .catch(err => console.log(err))
    .finally(res.redirect('/usercp'));
})

module.exports = router;