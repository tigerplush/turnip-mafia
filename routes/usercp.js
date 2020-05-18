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

        let user;
        turnipPrices.find(
            {
                userId: req.user.userId,
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
            let week = [
                {weekday: "Monday"},
                {weekday: "Tuesday"},
                {weekday: "Wednesday"},
                {weekday: "Thursday"},
                {weekday: "Friday"},
                {weekday: "Saturday"}
            ];

            if(user)
            {
                for(let i = 0; i < week.length; i++)
                {
                    week[i].amPrice = user.sellingPrices[i * 2];
                    week[i].pmPrice = user.sellingPrices[(i * 2) + 1];
                }
            }

            res.render('usercp.hbs',
            {
                usercp: true,
                defaultWeek: req.session.week,
                thisWeek: thisWeek,
                user: user,
                week: week,
            });
        });
    }
});

router.post('/', function(req, res, next)
{
    const turnipToUpdate = {};
    turnipToUpdate.userId = req.user.userId;
    turnipToUpdate.week = req.session.week;

    const turnip = {};
    turnip.userId = req.user.userId;
    turnip.userName = req.user.userName;
    turnip.week = req.session.week;
    turnip.buyingPrice = req.body.buyingPrice;
    turnip.sellingPrices = req.body.sellingPrices;

    turnipPrices.addOrUpdate(turnipToUpdate, turnip)
    .catch(err => console.log(err))
    .finally(res.redirect('/usercp'));
})

module.exports = router;