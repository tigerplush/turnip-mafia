function Week(
    googleId
    ,week
    ,firstTimeBuy
    ,buyingPrice
    ,buyingAmount
    ,sellingPrices
    ,previousPattern
    ,patterns
    )
{
    this.googleId = googleId;
    this.week = week;
    this.firstTimeBuy = firstTimeBuy || false;
    this.buyingPrice = buyingPrice || "";
    this.buyingAmount = buyingAmount || "";
    this.sellingPrices = sellingPrices || [];
    this.previousPattern = previousPattern || "";
    this.patterns = patterns || [];

    return this;
}

Week.prototype.FromObject = function(databaseEntry)
{
    this.googleId = databaseEntry.googleId;
    this.week = databaseEntry.week;
    this.firstTimeBuy = databaseEntry.firstTimeBuy;
    this.buyingPrice = databaseEntry.buyingPrice;
    this.buyingAmount = databaseEntry.buyingAmount;
    this.sellingPrices = databaseEntry.sellingPrices;
    this.previousPattern = databaseEntry.previousPattern;
    this.patterns = databaseEntry.patterns;

    return this;
}

Week.prototype.ToObject = function()
{
    var databaseEntry = {};

    databaseEntry.googleId = this.googleId;
    databaseEntry.week = this.week;
    databaseEntry.firstTimeBuy = this.firstTimeBuy;
    databaseEntry.buyingPrice = this.buyingPrice;
    databaseEntry.buyingAmount = this.buyingAmount;
    databaseEntry.sellingPrices = this.sellingPrices;
    databaseEntry.previousPattern = this.previousPattern;
    databaseEntry.patterns = this.patterns;

    return databaseEntry;
}

Week.prototype.toString = function()
{
    return JSON.stringify(this.ToObject());
}

Object.defineProperty(
    Week.prototype
    ,'Identifier'
    ,{
        get: function()
        {
            return {
                googleId: this.googleId
                ,week: this.week
            };
        }
    }
);

module.exports = Week;