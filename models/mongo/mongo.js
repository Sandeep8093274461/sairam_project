var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var DB = "covid19";
var DBCMP = "camp19";
var autoIncrement = require('mongodb-autoincrement');
var Binary = require('mongodb').Binary;
var fs = require('fs');


exports.queryFindAllWithDB = function (myobj, collectionName, DBConfig,callback) {
    MongoClient.connect(DBConfig.url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBConfig.DB);
        dbo.collection(collectionName).find(myobj).toArray(function (err, result) {
            if (err) throw err;
            callback(err,result);
            db.close();
        });
    });
};

exports.createCollection = function (collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.createCollection(collectionName, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.insertDocument = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).insertOne(myobj, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.removeDocument = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).remove(myobj, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.insertManyDocuments = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).insertMany(myobj, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.findOne = function (collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).findOne({}, function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.queryFindAll = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.queryFindAllWithSkip = function (myobj,project,sort,skip,limit, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj,project).sort(sort).skip(skip).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.queryFindAllProjection = function (myobj, project, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj, project).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.queryFindAllProjectionNameSort = function (myobj, project, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj, project).sort({name:1}).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
            
        });
    });
};


exports.queryWithAggregator = function (aggregate, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).aggregate(aggregate).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};


exports.queryFindAllSG = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj, { "sgList.$": 1 }).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.findAll = function (collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find({}).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.short = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find().sort(myobj).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.autoIncrement = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db(DB);
        autoIncrement.getNextSequence(dbo, collectionName, function (err, autoIndex) {
            myobj.spID = autoIndex;
            myobj.applicationNumber = "APP/2018-19/" + autoIndex;
            callback(myobj);
        });
    });
};

exports.autoIncrementApp = function (appRef, collectionName, callback) {
    if (appRef == undefined) {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            var dbo = db.db(DB);

            autoIncrement.getNextSequence(dbo, collectionName, function (err, autoIndex) {
                callback("APP/" + autoIndex);
            });

        });
    } else {
        callback(appRef);
    }
};

exports.autoIncrementSG = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db(DB);
        autoIncrement.getNextSequence(dbo, collectionName, function (err, autoIndex) {
            myobj.sgID = myobj.district.substring(0, 3) + "/" + autoIndex;
            callback(myobj);
        });
    });
};

exports.autoIncrementCrop = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db(DB);
        autoIncrement.getNextSequence(dbo, collectionName, function (err, autoIndex) {
            var cropRegCode = collectionName + "-" + autoIndex;
            callback(cropRegCode);
        });
    });
};

exports.short = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find().sort(myobj).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};


exports.updateOne = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $set: mvalue };
        dbo.collection(collectionName).updateOne(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};


exports.updatePush = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $push: mvalue };
        dbo.collection(collectionName).update(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.updateMany = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $set: mvalue };
        dbo.collection(collectionName).updateMany(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};


exports.fileUpload = function (mfile, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var insert_data = {};
        insert_data.file_data = Binary(mfile);
        dbo.collection('files').insertOne(insert_data, function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};
exports.queryFindSave = function (myobj,cropRegCode,collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj).toArray(function (err, result) {
            if (err) throw err;
            result.forEach(sg => {
               sg.cropList.forEach(function(crop){
                if(crop.cropRegCode == cropRegCode) {
                    crop.weekOfSowing = "555";
                    crop.monthOfSowing = "DEMO DEMO";
                }
                dbo.collection(collectionName).save();
                db.close();
                callback(true);
                });
            });
        });
    });
};

// Project Specific Queries
exports.findSGNameAndPhoneNumber = function (obj, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var count = 0;
        var demo = [];
        obj.forEach(element => {
            dbo.collection("seedGrowers").find({"cropList.cropRegCode":element.cropRegCode}).toArray(function (err, result) {
                if (err) throw err;
                count = count + 1;
                element.name = result[0].name;
                element.phone = result[0].phone;
                var elem = {
                    cropRegCode: element.cropRegCode,
                    reportNo: element.reportNo,
                    subReportNo: element.subReportNo,
                    registeredArea: element.registeredArea,
                    inspectionArea: element.inspectionArea,
                    name: result[0].name,
                    phone: result[0].phone
                }
                demo.push(elem);

            });

            if(obj.lenght >= count) {
                callback(demo);
                db.close();
            }
        });
    });
};

exports.autoIncrementGodown = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db(DB);
        autoIncrement.getNextSequence(dbo, collectionName, function (err, autoIndex) {
            myobj[0].godownId = autoIndex;
            callback(myobj);
        });
    });
};
exports.updateWithArrayFilter = function (mquery, mvalue,filter, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $set: mvalue };
        dbo.collection(collectionName).updateOne(mquery, newvalues,filter,function (err, res) {
            if (err) throw err;
            callback(res);
            db.close();
        });
    });
};

exports.updateWithArrayPush = function (mquery, mvalue,filter, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $push: mvalue };
        dbo.collection(collectionName).updateOne(mquery, newvalues,filter,function (err, res) {
            if (err) throw err;
            callback(res);
            db.close();
        });
    });
};


exports.queryWithAggregatorDB = function (aggregate, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBCMP);
        dbo.collection(collectionName).aggregate(aggregate).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};

exports.insertDocumentDB = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBCMP);
        dbo.collection(collectionName).insertOne(myobj, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.queryFindAllDB = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBCMP);
        dbo.collection(collectionName).find(myobj).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};


exports.removeDocumentDB = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBCMP);
        dbo.collection(collectionName).remove(myobj, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};



exports.updateOneDB = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DBCMP);
        var newvalues = { $set: mvalue };
        dbo.collection(collectionName).updateOne(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};
