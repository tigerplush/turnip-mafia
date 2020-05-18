const Datastore = require('nedb');
const fs = require('fs');
const path = require('path');

class Database
{
    constructor(dbPath, dbName)
    {
        if(!fs.existsSync(dbPath))
        {
            fs.mkdirSync(dbPath);
        }

        const dbFile = path.join(dbPath, dbName);
        this.database = new Datastore(dbFile);
        this.database.loadDatabase();
    }

    insert(doc)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.insert(doc, function(err, newDoc)
            {
                if(err)
                {
                    reject(err);
                }
                resolve(newDoc);
            })
        })
    }

    update(doc, updateDoc)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.update(
                doc,
                updateDoc,
                {},
                function(err, numberOfUpdated)
                {
                    if(err)
                    {
                        reject(err);
                    }
                    resolve(numberOfUpdated);
                }
            );
        });
    }

    saveUpdate(doc, updateDoc)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.update(
                doc,
                {$set: updateDoc},
                {},
                function(err, numberOfUpdated)
                {
                    if(err)
                    {
                        reject(err);
                    }
                    resolve(numberOfUpdated);
                }
            );
        });
    }

    addOrUpdate(doc, updateDoc)
    {
        return new Promise((resolve, reject) =>
        {
            this.update(doc, updateDoc)
            .then(numberOfUpdated =>
                {
                    if(numberOfUpdated === 0)
                    {
                        return this.insert(updateDoc);
                    }
                    resolve(numberOfUpdated);
                })
            .then(newDoc =>
                {
                    resolve(newDoc);
                })
            .catch(err => reject(err));
        });
    }

    find(doc)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.find(doc, function(err, docs)
            {
                if(err)
                {
                    reject(err);
                }
                resolve(docs);
            })
        })
    }

    findOne(doc)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.findOne(doc, function(err, doc)
            {
                if(err)
                {
                    reject(err);
                }
                resolve(doc);
            })
        });
    }

    remove(doc)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.remove(doc, function(err, numberOfRemoved)
            {
                if(err)
                {
                    reject(err);
                }
                resolve(numberOfRemoved);
            })
        });
    }
}

module.exports = Database;