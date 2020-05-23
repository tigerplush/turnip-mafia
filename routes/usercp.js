const express = require('express');
const router = express.Router();

const moment = require('moment');

const Week = require('../Week');

const multer = require('multer');

const timezones = require('../timezones');

const avatarStorage = multer.diskStorage({
    destination: 'public/avatars',
    filename: function(req, file, cb)
    {
        cb(null, `${req.user.id}.jpg`);
    }
});

const mapStorage = multer.diskStorage({
    destination: 'public/maps',
    filename: function(req, file, cb)
    {
        cb(null, `${req.user.id}.jpg`);
    }
});

const uploadAvatar = multer({storage: avatarStorage});
const uploadMap = multer({storage: mapStorage});

const userInfos = require('../Database/user');

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

            const timezoneObjects = timezones.map(timezone =>
                {
                    let selected = "";
                    if(req.user.timezone && req.user.timezone === timezone)
                    {
                        selected = "selected";
                    }
                    return {timezone: timezone, selected: selected}
                })

            res.render('usercp.hbs',
            {
                usercp: true,
                defaultWeek: req.session.week,
                thisWeek: thisWeek,
                user: user,
                userInfo: week.ToObject(),
                week: weekArray,
                timezones: timezoneObjects
            });
        });
    }
});

router.post('/userinfo', function(req, res, next)
{
    const user = req.user;
    if(req.body.timezone > 0)
    {
        user.timezone = `+${req.body.timezone}`;
    }
    user.timezone = req.body.timezone;
    user.twitterHandle = req.body.twitterHandle;
    user.discordTag = req.body.discordTag;

    userInfos.update(
        user.GoogleId,
        user.ToObject())
    .catch(err => console.log(err))
    .finally(() => res.redirect('/usercp'));
});

router.post('/islandinfo', function(req, res, next)
{
    const user = req.user;
    user.ingameName = req.body.ingameName;
    user.ingameTitle = req.body.ingameTitle;
    user.islandName = req.body.islandName;
    user.friendcode = req.body.friendcode;
    userInfos.update(
        user.GoogleId,
        user.ToObject())
    .catch(err => console.log(err))
    .finally(() => res.redirect('/usercp'));
});

router.post('/turnip', function(req, res, next)
{
    console.log(req.body);
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


router.post('/uploadAvatar', uploadAvatar.single('avatar'),
function(req, res)
{
    const user = req.user;
    filename = req.file.filename;
    user.avatar = filename;
    userInfos.update(
        user.GoogleId,
        user.ToObject())
    .catch(err => console.log(err))
    .finally(() => res.redirect('/usercp'));
});


router.post('/uploadMap', uploadMap.single('map'),
function(req, res)
{
    const user = req.user;
    filename = req.file.filename;
    user.map = filename;
    userInfos.update(
        user.GoogleId,
        user.ToObject())
    .catch(err => console.log(err))
    .finally(() => res.redirect('/usercp'));
});


module.exports = router;