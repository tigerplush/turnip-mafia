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
            const userPromises = docs.map(doc => userDb.findOne({googleId: doc.googleId}));
            return Promise.all(userPromises);
        })
    .then(users =>
        {
            turnips.forEach(turnip =>
                {
                    let i = users.findIndex(user => user.googleId === turnip.googleId);
                    if(i >= 0)
                    {
                        turnip.userName = users[i].userName;
                    }
                });
        })
    .catch(err => console.log(err))
    .finally(() =>
    {
        let dataSets = turnips.map(turnip =>
        {
            turnip.sellingPrices.unshift(turnip.buyingPrice);
            return DataSet.get(turnip.sellingPrices, turnip.userName);
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

router.get('/download', function(req, res, next)
{
    const thisWeek = moment().weekYear() + "-W" + moment().week();
    let week = req.query.week;
    if(!week)
    {
        week = thisWeek;
    }

    turnipPrices.find({week: week})
    .then(docs =>
        {
            turnips = docs;
            const userPromises = docs.map(doc => userDb.findOne({googleId: doc.googleId}));
            return Promise.all(userPromises);
        })
    .then(users =>
        {
            turnips.forEach(turnip =>
                {
                    let i = users.findIndex(user => user.googleId === turnip.googleId);
                    if(i >= 0)
                    {
                        turnip.userName = users[i].userName;
                    }
                });
            let downloadInfo = turnips.map(turnip =>
                {
                    return {
                        userName: turnip.userName
                        ,firstTimeBuy: turnip.firstTimeBuy
                        ,buyingPrice: turnip.buyingPrice
                        ,buyingAmount: turnip.buyingAmount || 0
                        ,sellingPrices: turnip.sellingPrices.toString()
                        ,previousPattern: turnip.previousPattern || "undefined"
                        ,patterns: turnip.patterns.toString() || [0, 0, 0, 0]
                    };
                })
            let csv = 'User name,First time buying?,Buy price,Amount of turnips,';
            csv += 'Mon AM,Mon PM,Tue AM,Tue PM,Wed AM,Wed PM,Thu AM,Thu PM,Fri AM,Fri PM,Sat AM,Sat PM,'
            csv += 'previous pattern,Random probability,Gentle Spike probability,Big Spike probability,Decreasing probability';
            downloadInfo.forEach(row =>
                {
                    csv += `\n${row.userName},`;
                    csv += row.firstTimeBuy == true ? `yes` : `no`;
                    csv += `,${row.buyingPrice},${row.buyingAmount},`;
                    csv += row.sellingPrices;
                    csv += `,${row.previousPattern},`;
                    csv += row.patterns;
                });
            res.setHeader('Content-disposition', `attachment; filename=${week}.csv`);
            res.set('Content-Type', 'test/csv');
            res.status(200).send(csv);
        })
    .catch(err => console.error(err));
});

module.exports = router;