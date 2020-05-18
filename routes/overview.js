const express = require('express');
const router = express.Router();

const moment = require('moment');

const Chart = require('chart.js');

class DataSet
{
    static get(prices, name)
    {
        const overviewChartOptions =
        {
            label: name,
            fill: false,
            data: prices,
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2
        };

        return overviewChartOptions;
    }
}

const turnipPrices = require('../Database/turnip-prices');
const userDb = require('../Database/user');

router.get('/', function(req, res, next)
{
    const thisWeek = moment().weekYear() + "-W" + moment().week();
    let week = req.query.week;
    if(!week)
    {
        week = thisWeek;
    }

    let turnips = [];
    turnipPrices.find({week: week})
    .then(docs =>
        {
            turnips = docs;
            const userPromises = docs.map(doc => userDb.find({userid: turnips.userId}));
            return Promise.all(userPromises);
        })
    .then(users =>
        {
            //console.log(users);
        })
    .catch(err => console.log(err))
    .finally(() =>
    {
        let dataSets = turnips.map(turnip =>
        {
            turnip.sellingPrices.unshift(turnip.buyingPrice);
            return DataSet.get(turnip.sellingPrices, turnip.name);
        });
        res.render('overview.hbs',
        {
            overview: true,
            defaultWeek: week,
            thisWeek: thisWeek,
            datasets: dataSets,
        });
    });
});

module.exports = router;