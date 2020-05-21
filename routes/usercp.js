const express = require('express');
const router = express.Router();

const moment = require('moment');

const Week = require('../Week');

const turnipPrices = require('../Database/turnip-prices');

router.get('/', function(req, res, next)
{
    const user = req.user;
    if(!user)
    {
        res.redirect('/');
    }
    else
    {
        const thisWeek = moment().weekYear() + "-W" + moment().week();

        let queryWeek = req.query.week;
        if(queryWeek)
        {
            req.session.week = queryWeek;
        }

        if(!req.session.week)
        {
            req.session.week = thisWeek;
        }

        let week = new Week(user.googleId, req.session.week);
        turnipPrices.find(week.Identifier)
        .then(docs =>
            {
                if(docs && docs.length > 0)
                {
                    week = new Week().FromObject(docs[0]);
                }
            })
        .catch(err => console.log(err))
        .finally(()=>
        {
            let weekArray = [
                {weekday: "Monday"},
                {weekday: "Tuesday"},
                {weekday: "Wednesday"},
                {weekday: "Thursday"},
                {weekday: "Friday"},
                {weekday: "Saturday"}
            ];

            if(week)
            {
                for(let i = 0; i < weekArray.length; i++)
                {
                    weekArray[i].amPrice = week.sellingPrices[i * 2];
                    weekArray[i].pmPrice = week.sellingPrices[(i * 2) + 1];
                }
            }

            res.render('usercp.hbs',
            {
                usercp: true,
                defaultWeek: req.session.week,
                thisWeek: thisWeek,
                user: user,
                userInfo: week.ToObject(),
                week: weekArray,
            });
        });
    }
});

router.post('/', function(req, res, next)
{
    const user = req.user;

    const week = new Week(
        user.googleId
        ,req.session.week
        ,req.body.firstTimeBuy
        ,req.body.buyingPrice
        ,req.body.buyingAmount
        ,req.body['sellingPrices[]']
        ,req.body.previousPattern
        ,req.body.patterns
        );

    turnipPrices.addOrUpdate(week.Identifier, week.ToObject())
    .catch(err => console.log(err))
    .finally(res.redirect('/usercp'));
})

module.exports = router;