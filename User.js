function User(
    googleId
    ,userName
    ,twitterHandle
    ,discordTag
    ,timezone
    ,friendcode
    ,ingameName
    ,islandName
    ,title
    )
{
    this.id = "";
    this.googleId = googleId;
    this.avatar = "";
    this.userName = userName || "";
    this.twitterHandle = twitterHandle || "";
    this.discordTag = discordTag || "";
    this.timezone = timezone || "";
    this.map = "";
    this.friendcode = friendcode || "";
    this.ingameName = ingameName || "";
    this.islandName = islandName || "";
    this.title = title || "";
    this.joinedAt = "";
    this.lastLogin = "";

    return this;
}

User.prototype.FromObject = function(databaseEntry)
{
    this.id = databaseEntry._id;
    this.googleId = databaseEntry.googleId;
    this.avatar = databaseEntry.avatar;
    this.userName = databaseEntry.userName;
    this.twitterHandle = databaseEntry.twitterHandle;
    this.discordTag = databaseEntry.discordTag;
    this.timezone = databaseEntry.timezone;
    this.map = databaseEntry.map;
    this.friendcode = databaseEntry.friendcode;
    this.ingameName = databaseEntry.ingameName;
    this.islandName = databaseEntry.islandName;
    this.title = databaseEntry.title;

    return this;
}

User.prototype.ToObject = function()
{
    var databaseEntry = {};

    databaseEntry.googleId = this.googleId;
    databaseEntry.avatar = this.avatar;
    databaseEntry.userName = this.userName;
    databaseEntry.twitterHandle = this.twitterHandle;
    databaseEntry.discordTag = this.discordTag;
    databaseEntry.timezone = this.timezone;
    databaseEntry.map = this.map;
    databaseEntry.friendcode = this.friendcode;
    databaseEntry.ingameName = this.ingameName;
    databaseEntry.islandName = this.islandName;
    databaseEntry.title = this.title;

    return databaseEntry;
}

User.prototype.toString = function()
{
    return JSON.stringify(this.ToObject());
}

Object.defineProperty(
    User.prototype
    ,'GoogleId'
    ,{
        get: function()
        {
            return {googleId: this.googleId};
        }
    }
);

Object.defineProperty(
    User.prototype
    ,'UserName'
    ,{
        get: function()
        {
            return this.userName;
        },
        set: function(userName)
        {
            this.userName = userName;
        }
    }
);

module.exports = User;