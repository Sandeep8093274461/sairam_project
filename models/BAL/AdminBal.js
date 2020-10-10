var mongo = require('../mongo/mongo');
const cYear = new Date().getFullYear().toString();
const cMonth = new Date().getMonth();
const cFinYear = cMonth >= 3 ? cYear + "-" + (parseInt(cYear.slice(2, 4)) + 1).toString() : (parseInt(cYear) - 1).toString() + "-" + cYear.slice(2, 4);
exports.getStateWiseDistList = (stateCode) => {
    return new Promise(async resolve => {
        mongo.queryFindAll({}, 'districtMaster', result => {
            resolve(result);
        });
    });
}
exports.getDateWiseDangerZoneData = (fromDate, toDate) => {
    return new Promise(resolve => {
        var aggregation = [
            // { $match: { $and: [ { fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(fromDate) } } ] } }
            { $match: { 
                $or : 
                    [ 
                        { $and: [ { fromDate: { $lte: new Date(toDate)} }, { toDate: { $gte: new Date(toDate)} }, ] },
                        { $and: [ { fromDate: { $lte: new Date(fromDate)} }, { toDate: { $gte: new Date(fromDate)} }, ] },
                        { $and: [ { fromDate: { $gte: new Date(fromDate)} }, { toDate: { $lte: new Date(toDate)} }, ] } 
                    ] 
                } 
            }
        ];
        mongo.queryWithAggregator(aggregation, "dangerZone", function (response) {
            resolve(response);
        });
    });
}
exports.addNewDangerZone = (data) => {
    return new Promise(resolve => {
        data.submitOn = new Date();
        data.finYear = cFinYear;
        data.fromDate = new Date(data.fromDate);
        data.toDate = new Date(data.toDate);
        mongo.insertDocument(data, 'dangerZone', result => {
            resolve(result);
        });
    });
}
exports.removeOneDangerZone = (data) => {
    return new Promise(resolve => {
        mongo.removeDocument(data, 'dangerZone', result => {
            resolve(result);
        });
    });
}
exports.updateOneDangerZone = (data) => {
    return new Promise(resolve => {
        mongo.updateOne({ lat: data.lat, lng: data.lng }, { name: data.name, fromDate: new Date(data.fromDate), toDate: new Date(data.toDate), desc: data.desc, updateOn: new Date() }, 'dangerZone', result => {
            resolve(result);
        });
    });
}
exports.getDateWiseWarningZoneData = (fromDate, toDate) => {
    return new Promise(resolve => {
        var aggregation = [
            // { $match: { $and: [ { fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(fromDate) } } ] } }
            { $match: { 
                $or : 
                    [ 
                        { $and: [ { fromDate: { $lte: new Date(toDate)} }, { toDate: { $gte: new Date(toDate)} }, ] },
                        { $and: [ { fromDate: { $lte: new Date(fromDate)} }, { toDate: { $gte: new Date(fromDate)} }, ] },
                        { $and: [ { fromDate: { $gte: new Date(fromDate)} }, { toDate: { $lte: new Date(toDate)} }, ] } 
                    ] 
                } 
            }
        ];
        mongo.queryWithAggregator(aggregation, "warningZone", function (response) {
            resolve(response);
        });
    });
}
exports.addNewWarningZone = (data) => {
    return new Promise(resolve => {
        data.submitOn = new Date();
        data.fromDate = new Date(data.fromDate);
        data.toDate = new Date(data.toDate);
        data.finYear = cFinYear;
        mongo.insertDocument(data, 'warningZone', result => {
            resolve(result);
        });
    });
}
exports.removeOneWarningZone = (data) => {
    return new Promise(resolve => {
        mongo.removeDocument(data, 'warningZone', result => {
            resolve(result);
        });
    })
}
exports.updateOneWarningZone = (data) => {
    return new Promise(resolve => {
        mongo.updateOne({ lat: data.lat, lng: data.lng }, { name: data.name, fromDate: new Date(data.fromDate), toDate: new Date(data.toDate), desc: data.desc, updateOn: new Date() }, 'warningZone', result => {
            resolve(result);
        });
    });
}
exports.addIndexCase = (data) => {
    return new Promise(resolve => {
        data.dangerZone.forEach( elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        })
        data.infectedSources.forEach( elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        })
        var licenseAggregation = [
            { $project: { _id: 0, caseNo: 1 } },
            { $unwind: "$caseNo" },
            { $project: { _id: 0, maxNo: { $toInt: "$caseNo" } } },
            { $sort: { maxNo: -1 } }
        ]
        mongo.queryWithAggregator(licenseAggregation, 'contactInfo', maxResult => {
            data.caseNo = maxResult.length == 0 ? 1 : maxResult[0].maxNo + 1;
            data.submitOn = new Date();
            data.finYear = cFinYear;
            data.infectedDate = new Date(data.infectedDate);
            mongo.insertDocument(data, 'contactInfo', result => {
                resolve(data.caseNo.toString());
            });
        });
    });
}
exports.getIndexCaseList = () => {
    return new Promise( resolve => {
        mongo.queryFindAll({}, 'contactInfo', result => {
            resolve(result);
        });
    });
}
exports.updateIndexCase = (caseNo, data) => {
    return new Promise(resolve => {
        data.dangerZone.forEach( elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        })
        data.infectedSources.forEach( elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        });
        data.infectedDate = new Date(data.infectedDate);
        data.updateOn = new Date();
        mongo.updateOne({ caseNo: caseNo }, data, 'contactInfo', result => {
            resolve(result);
        });
    });
}
exports.getLocationHistory = (caseNo) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { caseNo : parseInt(caseNo) } },
            { $project: { _id: 0, locationHistory: 1 } },
            { $project: { _id: 0, tlo: "$locationHistory.timelineObjects" } },
            { $project: { activitySegment: "$tlo.activitySegment" } },
            { $unwind: "$activitySegment" },
            { $project: { startLocation: "$activitySegment.startLocation", endLocation: "$activitySegment.endLocation", 
            startTimeStamp: { $toDouble : "$activitySegment.duration.startTimestampMs"}, endTimeStamp: "$activitySegment.duration.endTimestampMs",
            distance: "$activitySegment.distance", activityType: "$activitySegment.activityType" } },
        ]
        mongo.queryWithAggregator(aggregation, 'contactInfo', result => {
            result.forEach( e => {
                e.startTimeStamp = new Date(parseInt(e.startTimeStamp));
                e.endTimeStamp = new Date(parseInt(e.endTimeStamp));
            });
            resolve(result);
        });
    });
}
exports.getPrimaryContactVisitedPlaces = (caseNo) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { caseNo : parseInt(caseNo) } },
            { $project: { _id: 0, locationHistory: 1 } },
            { $project: { _id: 0, placeVisit: "$locationHistory.timelineObjects.placeVisit" } },
            { $unwind: "$placeVisit" },
            { $project: { 
                lat: "$placeVisit.location.latitudeE7", lng: "$placeVisit.location.longitudeE7", 
            address: "$placeVisit.location.address", name: "$placeVisit.location.name", placeId: "$placeVisit.location.placeId", 
            startTimeStamp: { $toDouble : "$placeVisit.duration.startTimestampMs"}, endTimeStamp: "$placeVisit.duration.endTimestampMs" } },
            { $sort: { startTimeStamp: 1 }}
        ]
        mongo.queryWithAggregator(aggregation, 'contactInfo', result => {
            result.forEach( e => {
                e.startTimeStamp = new Date(parseInt(e.startTimeStamp));
                e.endTimeStamp = new Date(parseInt(e.endTimeStamp));
            });
            resolve(result);
        });
    });
}


// NEW ADDED
exports.changeMyUpdates = (condition, newValue, collectionName) => {
    return new Promise(resolve => {
        mongo.updateOne(condition, newValue, collectionName, result => {
            resolve(result);
        });
    });
}
exports.removeMyDocument = (condition, collectionName) => {
    return new Promise(resolve => {
        mongo.removeDocument(condition, collectionName, result => {
            resolve(result);
        });
    });
}
exports.insertMyDocuments = (data, collectionName) => {
    return new Promise(resolve => {
        data.dangerZone.forEach( elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        });
        data.infectedSources.forEach( elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        });
        data.submitOn = new Date(data.submitOn);
        data.updateOn = new Date(data.updateOn);
        data.infectedDate = new Date(data.infectedDate);
        mongo.insertDocument(data, collectionName, result => {
            resolve(result);
        });
    });
}

//Added for blood Group

