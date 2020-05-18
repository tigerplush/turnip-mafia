const express = require('express');
const router = express.Router();

const moment = require('moment');

const Chart = require('chart.js');

const overviewChartOptions ={
    label: 'Unsure',
    fill: false,
    data: [106, 91],
    borderColor: [
        'rgba(255, 99, 132, 1)',
    ],
    borderWidth: 2
};

const dataSets =
[
    {
        label: 'Unsure',
        fill: false,
        data: [12, 19, 3, 5, 2, 3],
        borderColor:
        [
            'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2
    },
    {
        label: 'Small Spike',
        fill: false,
        data: [105, 91, 3, 5, 2, 3],
        borderColor:
        [
            'rgba(255, 155, 132, 1)',
        ],
        borderWidth: 2
    },
    {
        label: 'Big Spike',
        fill: false,
        data: [105, 91, 3, 5, 2, 3],
        borderColor:
        [
            'rgba(255, 155, 132, 1)',
        ],
        borderWidth: 2
    },
    {
        label: 'Decreasing',
        fill: false,
        data: [105, 91, 3, 5, 2, 3],
        borderColor:
        [
            'rgba(255, 155, 132, 1)',
        ],
        borderWidth: 2
    },
    {
        label: 'Random',
        fill: false,
        data: [105, 91, 3, 5, 2, 3],
        borderColor:
        [
            'rgba(255, 155, 132, 1)',
        ],
        borderWidth: 2
    }
];

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
    .catch(err => console.log(err));

    res.render('overview.hbs',
        {
            overview: true,
            defaultWeek: week,
            thisWeek: thisWeek,
            datasets: dataSets,
        });
});

module.exports = router;