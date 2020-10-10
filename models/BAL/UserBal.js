var mongo = require('../mongo/mongo');
const cYear = new Date().getFullYear().toString();
const cMonth = new Date().getMonth();
const cFinYear = cMonth >= 3 ? cYear + "-" + (parseInt(cYear.slice(2, 4)) + 1).toString() : (parseInt(cYear) - 1).toString() + "-" + cYear.slice(2, 4);




var { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'FM',
    password: '1234',
    port: 5432
});
// const pool = new Pool({
//     user: 'admin',
//     host: 'localhost',
//     database: 'ssssoodi_core',
//     password: 'vuWQ#FK$4',
//     port: 5432
// });

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "yourpassword",
    database: "ssssoodi_core"
});






exports.getUserDetails = async (user_id, callback) => {
    const client = await pool.connect().catch(e => { callback("Database Connection Error!!!!!") });
    try {
        let response = await client.query(`SELECT * FROM users where user_id = '${user_id}'`);
        callback(response.rows);
    } catch (e) {
        callback([]);
        throw e
    } finally {
        client.release();
    }
}
exports.changePassword = (user_id, newPass) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { callback("Database Connection Error!!!!!") });
        try {
            await client.query(`UPDATE users set password = '${newPass}' where user_id = '${user_id}'`);
            resolve(true);
        } catch (e) {
            reject("Server error.");
            throw e
        } finally {
            client.release();
        }
    })
}





exports.getActiveDangerZone = () => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { toDate: { $gte: new Date() } } }
        ];
        mongo.queryWithAggregator(aggregation, "dangerZone", function (response) {
            resolve(response);
        });
    });
}
exports.getActiveDangerContactZone = () => {
    return new Promise(resolve => {
        let toDate = new Date(new Date().setDate(new Date().getDate() - 3));
        var aggregation = [
            { $project: { _id: 0, infectedDate: 1, dangerZone: 1, caseNo: 1 } },
            { $unwind: { path: "$dangerZone" } },
            { $project: { caseNo: "$caseNo", infectedDate: "$infectedDate", name: "$dangerZone.name", lat: "$dangerZone.lat", lng: "$dangerZone.lng", fromDate: "$dangerZone.fromDate", toDate: "$dangerZone.toDate", desc: "$dangerZone.desc" } },
            { $match: { toDate: { $gte: toDate } } }
        ];
        mongo.queryWithAggregator(aggregation, "contactInfo", function (response) {
            resolve(response);
        });
    });
}
exports.getActiveWarningZone = () => {
    return new Promise(resolve => {
        // let toDate = new Date(new Date().setDate(new Date().getDate() - 3));
        var aggregation = [
            { $match: { toDate: { $gte: new Date() } } }
        ];
        mongo.queryWithAggregator(aggregation, "warningZone", function (response) {
            resolve(response);
        });
    });
}
exports.getDateWiseDangerZoneTimeLineData = (fromDate, toDate) => {
    return new Promise(resolve => {
        var aggregation = [
            {
                $match: {
                    $or:
                        [
                            { $and: [{ fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(toDate) } },] },
                            { $and: [{ fromDate: { $lte: new Date(fromDate) } }, { toDate: { $gte: new Date(fromDate) } },] },
                            { $and: [{ fromDate: { $gte: new Date(fromDate) } }, { toDate: { $lte: new Date(toDate) } },] }
                        ]
                }
            }
        ];
        mongo.queryWithAggregator(aggregation, "dangerZone", function (response) {
            resolve(response);
        });
    });
}
exports.getDateWiseDangerContactZoneTimeLineData = (fromDate, toDate) => {
    return new Promise(resolve => {
        var aggregation = [
            { $project: { _id: 0, infectedDate: 1, caseNo: 1, dangerZone: 1 } },
            { $unwind: { path: "$dangerZone" } },
            { $project: { caseNo: "$caseNo", infectedDate: "$infectedDate", name: "$dangerZone.name", lat: "$dangerZone.lat", lng: "$dangerZone.lng", fromDate: "$dangerZone.fromDate", toDate: "$dangerZone.toDate", desc: "$dangerZone.desc" } },
            // { $match: { $and : [ {toDate: { $gte: new Date(fromDate)} }, {toDate: { $lte: new Date(toDate)} } ] } }
            {
                $match: {
                    $or:
                        [
                            { $and: [{ fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(toDate) } },] },
                            { $and: [{ fromDate: { $lte: new Date(fromDate) } }, { toDate: { $gte: new Date(fromDate) } },] },
                            { $and: [{ fromDate: { $gte: new Date(fromDate) } }, { toDate: { $lte: new Date(toDate) } },] }
                        ]
                }
            }
        ];
        mongo.queryWithAggregator(aggregation, "contactInfo", function (response) {
            resolve(response);
        });
    });
}
exports.getDateWiseWarningZoneTimeLineData = (fromDate, toDate) => {
    return new Promise(resolve => {
        var aggregation = [
            // { $match: { toDate: { $gte: new Date(fromDate), $lte: new Date(toDate) } } }
            {
                $match: {
                    $or:
                        [
                            { $and: [{ fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(toDate) } },] },
                            { $and: [{ fromDate: { $lte: new Date(fromDate) } }, { toDate: { $gte: new Date(fromDate) } },] },
                            { $and: [{ fromDate: { $gte: new Date(fromDate) } }, { toDate: { $lte: new Date(toDate) } },] }
                        ]
                }
            }
        ];
        mongo.queryWithAggregator(aggregation, "warningZone", function (response) {
            resolve(response);
        });
    });
}
exports.getAllInfectedSources = () => {
    return new Promise(resolve => {
        var aggregation = [
            { $project: { _id: 0, infectedDate: 1, infectedSources: 1 } },
            { $unwind: { path: "$infectedSources" } },
            {
                $project: {
                    infectedDate: "$infectedDate", mode: "$infectedSources.journeyBy", fromLocation: "$infectedSources.fromLocation", toLocation: "$infectedSources.toLocation",
                    fromDate: "$infectedSources.fromDate", toDate: "$infectedSources.toDate", name: "$infectedSources.name",
                    transportNo: "$infectedSources.transportNo", personalId: "$infectedSources.personalId", seatNo: "$infectedSources.seatNo",
                    gadiName: "$infectedSources.gadiName"
                }
            },
        ];
        mongo.queryWithAggregator(aggregation, "contactInfo", function (response) {
            resolve(response);
        });
    });
}
exports.getInfectedSourcesDateWise = (mode, fromDate, toDate) => {
    return new Promise(resolve => {
        // let match = mode == 'All' ? 
        // { fromDate:{ $gte: new Date(fromDate), $lte: new Date(toDate) }, toDate: { $gte: new Date(fromDate), $lte: new Date(toDate) } } : 
        // { mode: mode, fromDate:{ $gte: new Date(fromDate), $lte: new Date(toDate) }, toDate: { $gte: new Date(fromDate), $lte: new Date(toDate) } }
        let match = mode == 'All' ?
            {
                $or:
                    [
                        { $and: [{ fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(toDate) } },] },
                        { $and: [{ fromDate: { $lte: new Date(fromDate) } }, { toDate: { $gte: new Date(fromDate) } },] },
                        { $and: [{ fromDate: { $gte: new Date(fromDate) } }, { toDate: { $lte: new Date(toDate) } },] }
                    ]
            } :
            {
                mode: mode,
                $or:
                    [
                        { $and: [{ fromDate: { $lte: new Date(toDate) } }, { toDate: { $gte: new Date(toDate) } },] },
                        { $and: [{ fromDate: { $lte: new Date(fromDate) } }, { toDate: { $gte: new Date(fromDate) } },] },
                        { $and: [{ fromDate: { $gte: new Date(fromDate) } }, { toDate: { $lte: new Date(toDate) } },] }
                    ]
            }
        var aggregation = [
            { $project: { _id: 0, infectedDate: 1, infectedSources: 1 } },
            { $unwind: { path: "$infectedSources" } },
            {
                $project: {
                    infectedDate: "$infectedDate", mode: "$infectedSources.journeyBy", fromLocation: "$infectedSources.fromLocation", toLocation: "$infectedSources.toLocation",
                    fromDate: "$infectedSources.fromDate", toDate: "$infectedSources.toDate", name: "$infectedSources.name",
                    transportNo: "$infectedSources.transportNo", personalId: "$infectedSources.personalId", seatNo: "$infectedSources.seatNo",
                    gadiName: "$infectedSources.gadiName"
                }
            },
            { $match: match }
        ];
        mongo.queryWithAggregator(aggregation, "contactInfo", function (response) {
            resolve(response);
        });
    });
}
exports.getNoOfAvlPatient = () => {
    return new Promise(resolve => {
        let licenseAggregation = [
            { $project: { _id: 0, caseNo: 1 } },
            { $unwind: "$caseNo" },
            { $project: { _id: 0, maxNo: { $toInt: "$caseNo" } } },
            { $sort: { maxNo: -1 } }
        ]
        mongo.queryWithAggregator(licenseAggregation, 'contactInfo', maxResult => {
            resolve(maxResult[0]);
        });
    });
}
exports.getPatientList = () => {
    return new Promise(resolve => {
        mongo.queryFindAll({}, 'COVID', result => {
            resolve(result);
        });
    });
}

// exports.addBloodGroup = (data) => {
//     return new Promise(async (resolve, reject) => {

//         const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

//         try {
//             let findMaxQuery = '';
//             let preMCode = '';
//             let queryText;
//             let queryText2;
//             findMaxQuery = `select max(cast(substr(donerid, 6, length(donerid)) as int )) from donordetails 
//                 where substr(donerid, 1, 4) = '${new Date().getFullYear()}'`
//             preMCode = new Date().getFullYear();

//             let maxResponse = await client.query(findMaxQuery);

//             let donerid = maxResponse.rows[0].max == null ? `${preMCode}/1` : `${preMCode}/${maxResponse.rows[0].max + 1}`

//             queryText = `INSERT INTO donordetails(submittedby,donerid,name,gender,dob,bg,lastdonationdate,district,address,contactno,contactref,registeredon,firsttimedonate)
//                 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13)`;
//             values = [data.user_id, donerid, data.name, data.gender, data.dateOfBirth, data.bloodGroup, data.lastDonationDate, data.district, data.Address, data.contactNo, data.contactRef, 'NOW()', 'NOW()'];
//             queryText2 = `INSERT INTO donordetails1(donerid,districtofdonation,placeofdonation,donationdate)
//                 VALUES($1, $2, $3, $4)`;
//             values2 = [donerid, data.district, data.district, 'NOW()'];

//             let response = await client.query(queryText, values);
//             let response2 = await client.query(queryText2, values2);
//             resolve(true);
//         } catch (e) {
//             reject(e);
//             throw e;
//         } finally {
//             client.release();
//         }



//     });




//     // return new Promise(resolve => {

//     //     var licenseAggregation = [
//     //         { $project: { _id: 0, donorId: 1 } },
//     //         { $unwind: "$donorId" },
//     //         { $project: { _id: 0, maxNo: { $toInt: "$donorId" } } },
//     //         { $sort: { maxNo: -1 } }
//     //     ]
//     //     mongo.queryWithAggregator(licenseAggregation, 'donorDetails', maxResult => {
//     //         data.donorId = maxResult.length == 0 ? 1 : maxResult[0].maxNo + 1;
//     //         data.donationDate = new Date();
//     //         mongo.insertDocument(data, 'donorDetails', result => {
//     //             resolve(data.donorId.toString());
//     //         });
//     //     });
//     // });
// }

exports.addBloodGroup = (data) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

        try {
            let findMaxQuery = '';
            let preMCode = '';
            let queryText;
            let queryText2;
            findMaxQuery = `select max(cast(substr(donerid, 6, length(donerid)) as int )) from donordetails 
                where substr(donerid, 1, 4) = '${new Date().getFullYear()}'`
            preMCode = new Date().getFullYear();

            let maxResponse = await client.query(findMaxQuery);

            let donerid = maxResponse.rows[0].max == null ? `${preMCode}/1` : `${preMCode}/${maxResponse.rows[0].max + 1}`

            queryText = `INSERT INTO donordetails(submittedby,donerid,name,gender,dob,bg,lastdonationdate,district,address,contactno,contactref,registeredon)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12)`;
            values = [data.user_id, donerid, data.name, data.gender, data.dateOfBirth, data.bloodGroup, data.lastDonationDate, data.district, data.Address, data.contactNo, data.contactRef, 'NOW()'];
            queryText2 = `INSERT INTO donordetails1(donerid,districtofdonation,placeofdonation,donationdate)
                VALUES($1, $2, $3, $4)`;
            values2 = [donerid, data.district, data.Address, data.lastDonationDate];


            let response = await client.query(queryText, values);
            let response2 = await client.query(queryText2, values2);
            resolve(true);
        } catch (e) {

            reject(e);
            throw e;
        } finally {
            client.release();
        }



    });




    
}

exports.addUserDetails = (data) => {
    return new Promise(resolve => {

        var licenseAggregation = [
            { $project: { _id: 0, id: 1 } },
            { $unwind: "$id" },
            { $project: { _id: 0, maxNo: { $toInt: "$id" } } },
            { $sort: { maxNo: -1 } }
        ]
        mongo.queryWithAggregator(licenseAggregation, 'districtDetails', maxResult => {
            data.id = maxResult.length == 0 ? 1 : maxResult[0].maxNo + 1;
            mongo.insertDocument(data, 'districtDetails', result => {
                resolve(data.id.toString());
            });
        });
    });
}
exports.addDonoationDetails = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            client.query('BEGIN');
            let response = await client.query(`UPDATE donordetails set lastdonationdate = '${data.donationDate}',donatedby ='${data.donatedBy}' where donerid = '${data.donorId}' `);

            let queryText2 = `insert into donordetails1 (donerid, placeofdonation, districtofdonation,donationdate,donatedby)  VALUES($1,$2,$3,$4,$5) `;
            let values = [data.donorId, data.currentPlace, data.currentDistrict, data.donationDate,data.donatedBy];

            let addIndentDesc = await client.query(queryText2, values);
            await addIndentDesc;


            client.query('COMMIT');
            resolve(true);



        } catch (e) {
            client.query('ROLLBACK');
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });

}
exports.addCampDetails = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let findMaxQuery = '';
            let preMCode = '';
            findMaxQuery = `select max(cast(substr(campid, 4, length(campid)) as int )) from campdetails 
                where substr(campid, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let campid = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`

            let queryText = `INSERT INTO campdetails(submittedby,campid,cmpplace,dist,cmpaddress,cmpnodonors,cmpdate,campdateto,cmpremark,idpurl,registeredon)
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11)`;
            let values = [data.user_id, campid, data.cmpPlace, data.dist, data.cmpAddress, data.cmpNoDonors, data.cmpDate, data.cmpDateTo, data.cmpRemark, data.idpUrl, 'NOW()'];

            let response = await client.query(queryText, values);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }

    });
    // return new Promise(resolve => {

    //     var licenseAggregation = [
    //         { $project: { _id: 0, campId: 1 } },
    //         { $unwind: "$campId" },
    //         { $project: { _id: 0, maxNo: { $toInt: "$campId" } } },
    //         { $sort: { maxNo: -1 } }
    //     ]
    //     mongo.queryWithAggregatorDB(licenseAggregation, 'campDetails', maxResult => {
    //         data.campId = maxResult.length == 0 ? 1 : maxResult[0].maxNo + 1;
    //         data.campDate = new Date();
    //         mongo.insertDocumentDB(data, 'campDetails', result => {
    //             resolve(data.campId.toString());
    //         });
    //     });
    // });
}
exports.campUpdateDataDeleted = (campid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM campdetails where campid='${campid}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.getCampList = (data) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let queryText;
            queryText = `SELECT * FROM campdetails
            where cmpdate >= '${new Date(data.fromDate).toDateString()}' and cmpdate <= '${new Date(data.toDate).toDateString()}' and dist='${data.user_id}'`
            // let response = await client.query(`SELECT * FROM campdetails
            //   where cmpdate >= '${new Date(data.fromDate).toDateString()}' and cmpdate <= '${new Date(data.toDate).toDateString()}' and dist='${data.district}'`);

            let response = await client.query(queryText);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}

exports.getDonorList = (district) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

        try {
            let response = await client.query(`SELECT * FROM donordetails where district='${district}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }



    });
    // After editing cooments

    // return new Promise(resolve => {
    //     mongo.queryFindAll({}, 'donorDetails', result => {
    //         resolve(result);
    //     });
    // });
}
exports.getIndividualDonorDetails = (data) => {

    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        let queryText;
        try {


            if (data.bg == undefined) {
                queryText = `SELECT a.*, b.donerid as doner_id FROM donordetails a 
                left join donordetails1 b on a.donerid = b.donerid
                 where a.district = '${data.district}'   and (a.lastdonationdate>= '${new Date(data.fromDate).toDateString()}' and a.lastdonationdate<= '${new Date(data.toDate).toDateString()}' OR  donationdate is NULL )' `;
            }
            else {
                queryText = `SELECT a.*, b.donerid as doner_id FROM donordetails a 
                left join donordetails1 b on a.donerid = b.donerid
                 where a.district = '${data.district}' and a.bg = '${data.bg}' and  (a.lastdonationdate>= '${new Date(data.fromDate).toDateString()}' and a.lastdonationdate<= '${new Date(data.toDate).toDateString()}' OR  donationdate is NULL ) `;
            }
            let response = await client.query(queryText);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }



    });
    // After editing cooments

    // return new Promise(resolve => {
    //     mongo.queryFindAll({}, 'donorDetails', result => {
    //         resolve(result);
    //     });
    // });
}
exports.donorDataDeleted = (donerid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM donordetails where donerid='${donerid}'`);
            let response2 = await client.query(`DELETE FROM donordetails1 where donerid='${donerid}'`);
            resolve(true);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });



}

exports.getUserListTotal = () => {
    return new Promise(resolve => {
        mongo.queryFindAll({}, 'districtDetails', result => {
            resolve(result);
        });
    });
}

exports.getUserList = (un) => {
    return new Promise(resolve => {
        mongo.queryFindAll({ userName: un }, 'districtDetails', result => {
            resolve(result);
        });
    });
}

exports.getUserMail = (mail) => {
    return new Promise(resolve => {
        mongo.queryFindAll({ email: mail }, 'districtDetails', result => {
            resolve(result);
        });
    });
}


exports.updateDonor = (donorId, data) => {
    return new Promise(resolve => {
        mongo.findByIdAndUpdate({ donorId: donorId }, data, 'donorDetails', result => {
            resolve(result);
        });
    });
}

exports.removeDonor = (data) => {
    return new Promise(resolve => {
        mongo.removeDocument(data, 'donorDetails', result => {
            resolve(result);
        });
    })
}

exports.getDonorById = (donerid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM donordetails where donerid='${donerid}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}

exports.getDonationById = (donorId) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { donorId: parseInt(donorId) } },
        ]
        mongo.queryWithAggregator(aggregation, 'donoationDetails', result => {
            resolve(result);
        });
    });
}
// NEW ADDED
exports.changeMyUpdates = (donerid, data, previousLastDonationDate) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            if (previousLastDonationDate == null) {
                if (data.lastDonationDate == null) {
                    let queryText = `UPDATE donordetails set name = '${data.name}',gender = '${data.gender}',dob = '${data.dateOfBirth}',bg = '${data.bloodGroup}',lastdonationdate = NULL ,district = '${data.district}',address = '${data.Address}',contactno = '${data.contactNo}',contactref = '${data.contactRef}',dataupdatedon = 'NOW()'
                where donerid = '${donerid}' `
                    let response = await client.query(queryText);
                    let queryText1 = `UPDATE donordetails1 set districtofdonation = '${data.district}',placeofdonation = '${data.Address}',donationdate = NULL
                where donerid = '${donerid}'  `
                    let response2 = await client.query(queryText1);

                    // donerid,districtofdonation,placeofdonation,donationdate
                }
                else {
                    let queryText3 =`UPDATE donordetails set name = '${data.name}',gender = '${data.gender}',dob = '${data.dateOfBirth}',bg = '${data.bloodGroup}',lastdonationdate = '${data.lastDonationDate}',district = '${data.district}',address = '${data.Address}',contactno = '${data.contactNo}',contactref = '${data.contactRef}',dataupdatedon = 'NOW()'
                    where donerid = '${donerid}' `
                    let response = await client.query(queryText3);
                    let queryText4 =`UPDATE donordetails1 set districtofdonation = '${data.district}',placeofdonation = '${data.Address}',donationdate = '${data.lastDonationDate}'
                    where donerid = '${donerid}'  AND donationdate is NULL `
                    let response2 = await client.query(queryText4);

                }
            }
            else{
                previousLastDonationDate = JSON.stringify(new Date(Date.parse(previousLastDonationDate) + 106199999));
                previousLastDonationDate = previousLastDonationDate.split('T')[0];
                if (data.lastDonationDate == null) {
                    let queryText =`UPDATE donordetails set name = '${data.name}',gender = '${data.gender}',dob = '${data.dateOfBirth}',bg = '${data.bloodGroup}',lastdonationdate = NULL ,district = '${data.district}',address = '${data.Address}',contactno = '${data.contactNo}',contactref = '${data.contactRef}',dataupdatedon = 'NOW()'
                    where donerid = '${donerid}' `
                    let response = await client.query(queryText);
                    let queryText1 =`UPDATE donordetails1 set districtofdonation = '${data.district}',placeofdonation = '${data.Address}',donationdate = NULL
                    where donerid = '${donerid}'  AND donationdate ='${previousLastDonationDate}'`
                    let response2 = await client.query(queryText1);
                  
                    // donerid,districtofdonation,placeofdonation,donationdate
                }
                else {
                    let queryText3 =`UPDATE donordetails set name = '${data.name}',gender = '${data.gender}',dob = '${data.dateOfBirth}',bg = '${data.bloodGroup}',lastdonationdate = '${data.lastDonationDate}',district = '${data.district}',address = '${data.Address}',contactno = '${data.contactNo}',contactref = '${data.contactRef}',dataupdatedon = 'NOW()'
                    where donerid = '${donerid}' `
                    let response = await client.query(queryText3);
                    let queryText4 =`UPDATE donordetails1 set districtofdonation = '${data.district}',placeofdonation = '${data.Address}',donationdate = '${data.lastDonationDate}'
                    where donerid = '${donerid}'  AND donationdate ='${previousLastDonationDate}' `
                    let response2 = await client.query(queryText4);
                    
                   
                }
            }



            resolve(true);

        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });

    // return new Promise(resolve => {
    //     mongo.updateOne(condition, newValue, collectionName, result => {
    //         resolve(result);
    //     });
    // });
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
        data.dangerZone.forEach(elemnt => {
            elemnt.fromDate = new Date(elemnt.fromDate);
            elemnt.toDate = new Date(elemnt.toDate);
        });
        data.infectedSources.forEach(elemnt => {
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

exports.getDonorFilterList = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {



            if (data.status == 'Available') {
                response = await client.query(`SELECT * FROM donordetails where bg='${data.bg}' AND (lastdonationdate <  CURRENT_DATE - INTERVAL '3 months' OR lastdonationdate IS NULL) and district ='${data.district}' `);
            }
            else {
                response = await client.query(`SELECT * FROM donordetails where bg='${data.bg}' AND lastdonationdate >  CURRENT_DATE - INTERVAL '3 months'and district ='${data.district}' `);
            }
            resolve(response.rows);


        }

        catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });

    // return new Promise(resolve => {
    //     mongo.queryFindAll({ bloodGroup: bloodGroup }, 'donorDetails', result => {
    //         resolve(result);
    //     });
    // });
}


exports.removeMyDocumentDB = (condition, collectionName) => {
    return new Promise(resolve => {
        mongo.removeDocumentDB(condition, collectionName, result => {
            resolve(result);
        });
    });
}

exports.changeMyUpdatesDB = (condition, newValue, collectionName) => {
    return new Promise(resolve => {
        mongo.updateOneDB(condition, newValue, collectionName, result => {
            resolve(result);
        });
    });
}


exports.getCmpById = (cmpId) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { campId: parseInt(cmpId) } },
        ]
        mongo.queryWithAggregatorDB(aggregation, 'campDetails', result => {
            resolve(result);
        });
    });
}

exports.getUserById = (id) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { id: parseInt(id) } },
        ]
        mongo.queryWithAggregator(aggregation, 'districtDetails', result => {
            resolve(result);
        });
    });
}

exports.validateUserDataLogin = (data) => {

    let match =
    {
        $and:
            [
                { $and: [{ userName: data.username },] }
            ]
    }

    return new Promise(resolve => {
        var aggregation = [
            { $match: match },
        ]
        mongo.queryWithAggregator(aggregation, 'districtDetails', result => {
            resolve(result);
        });
    });
}

exports.addConvenorDetails = (data) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let queryText = `INSERT INTO seva_data(date, samiti, district_id, location, nfp, nfk, other_items, detail_of_seva, nosdi, app_cost, photo2, user_id, add_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING conv_id`;
            let values = [new Date(data.Date), data.SevaSamithi, data.dist_id, data.Address, data.nfp, data.nak, data.othitems, data.bdos, data.nsi, data.aci, data.photo2, data.userId, "NOW()"];
            let response = await client.query(queryText, values);
            resolve(response.rows[0].conv_id.toString());
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });
}

exports.getConvenorList = () => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.* FROM seva_data a`);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}

exports.getFilteredConvenorData = (data) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let queryText;
            if (data.dist_id == undefined) {
                queryText = `SELECT a.*, b.name as dist_name FROM seva_data a 
                inner join district_master b on a.district_id = b.district_id
                where date >= '${new Date(data.fromDate).toDateString()}' and date <= '${new Date(data.toDate).toDateString()}' order by dist_name, a.date desc`
            } else {
                queryText = `SELECT a.*, b.name as dist_name FROM seva_data a 
                inner join district_master b on a.district_id = b.district_id
                where a.district_id = '${data.dist_id}' and date >= '${new Date(data.fromDate).toDateString()}' and date <= '${new Date(data.toDate).toDateString()}' order by dist_name, a.date desc`
            }
            let response = await client.query(queryText);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}

exports.getConvenorListun = (un) => {
    return new Promise(resolve => {
        mongo.queryFindAll({ District: un }, 'ConvenorDetails', result => {
            resolve(result);
        });
    });
}
exports.getDistWiseSamithiList = (dist_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT samithi_id, name FROM samithi where dist_id='${dist_id}'`);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.getConvenorDetailsId = (convId) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { convId: parseInt(convId) } },
        ]
        mongo.queryWithAggregatorDB(aggregation, 'ConvenorDetails', result => {
            resolve(result);
        });
    });
}
exports.getConvenordatadist = () => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM district_master`);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.removeSevaData = (conv_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            await client.query(`DELETE FROM seva_data where conv_id=${conv_id}`);
            resolve(true);
        } catch (e) {
            resolve(false);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.getSevaSamitiList = (dist_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM samiti where district_id='${dist_id}'`);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}

exports.getConvenordatabydist = (dist) => {
    return new Promise(resolve => {
        var aggregation = [
            { $match: { District: dist } },
        ]
        mongo.queryWithAggregatorDB(aggregation, 'ConvenorData', result => {
            resolve(result);
        });
    });
}

// let queryText = `SELECT b.ddd FROM migrate_skill_table_data a
// inner join migrate_data b on b.migraee=a.migraeid
// where a.skill= 'fromclien'
// group b b.ddd`

exports.addMigrateData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            client.query('BEGIN');
            let findMaxQuery = '';
            let preMCode = '';

            findMaxQuery = `select max(cast(substr(migrate_id, 4, length(migrate_id)) as int )) from migrate_data 
                where substr(migrate_id, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let migrate_id = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`

            let queryText = '';
            let values = '';

            if (data.animals === 'Yes') {

                queryText = `INSERT INTO migrate_data(migrate_id,user_id, migrant_name,dob,gender,mobno,category,material,fathername,fmember,district,block,gp,village,
                        farmerid,acnumber,aadharnumber,voterid,landarea,salary,monthlyincome,qualification,skilldevelopmentcertification,migrant,animals,noofcows,noofgoat,noofsheep,noofotheranimal,
                        returningstate,planafterlockdown,staybackafterlockdown,expectedsalary,undermgnrega,
                        remarksbythesurveyer,dataapplied)
                         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,$27, $28, $29, $30, $31, $32, $33,$34,$35,$36)`;
                values = [migrate_id, data.user_id, data.migrantName, data.dob, data.gender, data.mobNo, data.category, data.material, data.fatherName, data.fMember, data.dist_id, data.block, data.gp, data.village,
                    data.farmerId, data.acNumber, data.aadharNumber, data.voterId, data.landArea, data.salary, data.monthlyIncome, data.qualification, data.skillDevelopmentCertification, data.migrant, data.animals, data.noOfCows, data.noOfGoat, data.noOfSheep, data.noOfOtherAnimal,
                    data.returningState, data.planAfterLockDown, data.stayBackAfterLockDown, data.expectedSalary, data.underMGNREGA,
                    data.remarksByTheSurveyer, 'NOW()'];
            }
            else {
                queryText = `INSERT INTO migrate_data(migrate_id,user_id, migrant_name,dob,gender,mobno,category,material,fathername,fmember,district,block,gp,village,
                        farmerid,acnumber,aadharnumber,voterid,landarea,salary,monthlyincome,qualification,skilldevelopmentcertification,migrant,animals,noofcows,noofgoat,noofsheep,noofotheranimal,
                        returningstate,planafterlockdown,staybackafterlockdown,expectedsalary,undermgnrega,
                        remarksbythesurveyer,dataapplied)
                         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,$27, $28, $29, $30, $31, $32, $33,$34,$35,$36)`;
                values = [migrate_id, data.user_id, data.migrantName, data.dob, data.gender, data.mobNo, data.category, data.material, data.fatherName, data.fMember, data.dist_id, data.block, data.gp, data.village,
                    data.farmerId, data.acNumber, data.aadharNumber, data.voterId, data.landArea, data.salary, data.monthlyIncome, data.qualification, data.skillDevelopmentCertification, data.migrant, data.animals, null, null, null, null,
                    data.returningState, data.planAfterLockDown, data.stayBackAfterLockDown, data.expectedSalary, data.underMGNREGA,
                    data.remarksByTheSurveyer, 'NOW()'];
            }

            let addMigrateDetail = client.query(queryText, values);



            let queryText2 = `insert into migrate_skill_table_data (migrate_id, sectoremployed, skill, workexperience, avgincome, intrestskill, description, remarks) values `;
            data.display.forEach(element => {
                queryText2 += `('${migrate_id}', '${element.sectoremployed}','${element.skill}','${element.workexperience}','${element.avgincome}','${element.intrestskill}','${element.description}','${element.remarks}'), `;
            })
            let addIndentDesc = client.query(queryText2.substring(0, queryText2.length - 2));
            await addIndentDesc;
            await addMigrateDetail;
            client.query('COMMIT');
            resolve(true);

        } catch (e) {
            client.query('ROLLBACK');
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });
}
exports.allSkillDataShow = (district_id, user_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

        try {
            let response = await client.query(`SELECT  DISTINCT  ON (c.migrate_id) c.migrate_id,a.*,b.name as dist_name,c.* FROM migrate_data a
                inner join district_master b on a.district = b.district_id 
                inner join migrate_skill_table_data c on a.migrate_id = c.migrate_id where district='${district_id}'`);
            let response12 = await client.query(`SELECT * FROM migrate_skill_table_data `);
            var res = { details: response.rows, skilldetails: response12.rows }
            resolve(res);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }



    });
}
exports.getApplicationDetails = (migrate_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            // SELECT  a.*, b.name as dist_name FROM resource_person_data  a 
            // inner join district_master b on a.dist = b.district_id
            // let response = await client.query(`SELECT a.*, b.* FROM migrate_data a
            // inner join migrate_skill_table_data b on a.migrate_id = b.migrate_id
            //   where a.migrate_id='${migrate_id}'`);
            let response = await client.query(`SELECT * FROM migrate_data  where migrate_id='${migrate_id}'`);
            let response12 = await client.query(`SELECT * FROM migrate_skill_table_data  where migrate_id='${migrate_id}'`);
            var res = { details: response.rows[0], movieArray: response12.rows }


            resolve(res);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.skillCheck = () => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let queryText = `SELECT b.name FROM migrate_skill_table_data a
            inner join migrate_data b on b.migrate_id=a.migrate_id
            where a.skill= 'fromclient'
            group b b.name`


            resolve(res);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.updateMigrateData = (migrate_id, data, district_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });


        try {
            client.query('BEGIN');


            if (data.migrant === 'Yes') {
                if (data.animals === 'Yes') {
                    let response = await client.query(`UPDATE migrate_data set migrant_name = '${data.migrantName}',dob = '${data.dob}', gender = '${data.gender}', mobno = '${data.mobNo}', category = '${data.category}', material = '${data.material}', fathername = '${data.fatherName}', fmember = '${data.fMember}', 
                        block = '${data.block}', gp = '${data.gp}', village = '${data.village}', farmerid = '${data.farmerId}',acnumber = '${data.acNumber}',aadharnumber = '${data.aadharNumber}', voterid = '${data.voterId}',landarea = '${data.landArea}', salary = '${data.salary}',monthlyincome = '${data.monthlyIncome}', qualification = '${data.qualification}', skilldevelopmentcertification = '${data.skillDevelopmentCertification}', animals = '${data.animals}', migrant = '${data.migrant}', noofcows = '${data.noOfCows}',
                        noofgoat  = '${data.noOfGoat}', noofsheep = '${data.noOfSheep}', noofotheranimal = '${data.noOfOtherAnimal}', planafterlockdown = '${data.planAfterLockDown}',returningstate = '${data.returningState}',staybackafterlockdown = '${data.stayBackAfterLockDown}', expectedsalary = '${data.expectedSalary}', undermgnrega = '${data.underMGNREGA}',
                        remarksbythesurveyer = '${data.remarksByTheSurveyer}',dataupdatedon = 'Now()'
                        where migrate_id = '${migrate_id}' `);
                }
                else {
                    let response = await client.query(`UPDATE migrate_data set migrant_name = '${data.migrantName}',dob = '${data.dob}', gender = '${data.gender}', mobno = '${data.mobNo}', category = '${data.category}', material = '${data.material}', fathername = '${data.fatherName}', fmember = '${data.fMember}', 
                        block = '${data.block}', gp = '${data.gp}', village = '${data.village}', farmerid = '${data.farmerId}',acnumber = '${data.acNumber}',aadharnumber = '${data.aadharNumber}', voterid = '${data.voterId}',landarea = '${data.landArea}', salary = '${data.salary}',monthlyincome = '${data.monthlyIncome}', qualification = '${data.qualification}', skilldevelopmentcertification = '${data.skillDevelopmentCertification}', animals = '${data.animals}', migrant = '${data.migrant}', noofcows = '',
                        noofgoat  = '', noofsheep = '', noofotheranimal = '', planafterlockdown = '${data.planAfterLockDown}',returningstate = '${data.returningState}',staybackafterlockdown = '${data.stayBackAfterLockDown}', expectedsalary = '${data.expectedSalary}', undermgnrega = '${data.underMGNREGA}',
                        remarksbythesurveyer = '${data.remarksByTheSurveyer}',dataupdatedon = 'Now()'
                        where migrate_id = '${migrate_id}' `);

                }

            }
            else {
                if (data.animals === 'Yes') {
                    let response = await client.query(`UPDATE migrate_data set migrant_name = '${data.migrantName}',dob = '${data.dob}', gender = '${data.gender}', mobno = '${data.mobNo}', category = '${data.category}', material = '${data.material}', fathername = '${data.fatherName}', fmember = '${data.fMember}', 
                        block = '${data.block}', gp = '${data.gp}', village = '${data.village}', farmerid = '${data.farmerId}',acnumber = '${data.acNumber}',aadharnumber = '${data.aadharNumber}', voterid = '${data.voterId}',landarea = '${data.landArea}', salary = '${data.salary}',monthlyincome = '${data.monthlyIncome}', qualification = '${data.qualification}', skilldevelopmentcertification = '${data.skillDevelopmentCertification}', animals = '${data.animals}', migrant = '${data.migrant}', noofcows = '${data.noOfCows}',
                        noofgoat  = '${data.noOfGoat}', noofsheep = '${data.noOfSheep}', noofotheranimal = '${data.noOfOtherAnimal}', planafterlockdown = '',returningstate = '',staybackafterlockdown = '', expectedsalary = '', undermgnrega = '',
                        remarksbythesurveyer = '${data.remarksByTheSurveyer}',dataupdatedon = 'Now()'
                        where migrate_id = '${migrate_id}' `);
                }
                else {
                    let response = await client.query(`UPDATE migrate_data set migrant_name = '${data.migrantName}',dob = '${data.dob}', gender = '${data.gender}', mobno = '${data.mobNo}', category = '${data.category}', material = '${data.material}', fathername = '${data.fatherName}', fmember = '${data.fMember}', 
                        block = '${data.block}', gp = '${data.gp}', village = '${data.village}', farmerid = '${data.farmerId}',acnumber = '${data.acNumber}',aadharnumber = '${data.aadharNumber}', voterid = '${data.voterId}',landarea = '${data.landArea}', salary = '${data.salary}',monthlyincome = '${data.monthlyIncome}', qualification = '${data.qualification}', skilldevelopmentcertification = '${data.skillDevelopmentCertification}', animals = '${data.animals}', migrant = '${data.migrant}', noofcows = '',
                        noofgoat  = '', noofsheep = '', noofotheranimal = '', planafterlockdown = '',returningstate = '',staybackafterlockdown = '', expectedsalary = '', undermgnrega = '',
                        remarksbythesurveyer = '${data.remarksByTheSurveyer}',dataupdatedon = 'Now()'
                        where migrate_id = '${migrate_id}' `);

                }

            }


            let response2 = await client.query(`DELETE FROM migrate_skill_table_data where migrate_id='${migrate_id}'`);
            let queryText2 = `insert into migrate_skill_table_data (migrate_id, sectoremployed, skill, workexperience, avgincome, intrestskill, description, remarks) values `;
            data.display.forEach(element => {
                queryText2 += `('${migrate_id}', '${element.sectoremployed}','${element.skill}','${element.workexperience}','${element.avgincome}','${element.intrestskill}','${element.description}','${element.remarks}'), `;
            })
            let addIndentDesc = client.query(queryText2.substring(0, queryText2.length - 2));
            await addIndentDesc;


            client.query('COMMIT');
            resolve(true);



        } catch (e) {
            client.query('ROLLBACK');
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });
}
exports.oneDataDeleted = (migrate_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM migrate_data where migrate_id='${migrate_id}'`);
            let response2 = await client.query(`DELETE FROM migrate_skill_table_data where migrate_id='${migrate_id}'`);

            resolve(true);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}

exports.getStates = () => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM state_master `);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
};

exports.allMigrantDatashow = (migrate_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {

            // let response = await client.query(`SELECT * FROM migrate_data  where migrate_id='${migrate_id}'`);
            // let response12 = await client.query(`SELECT * FROM migrate_skill_table_data  where migrate_id='${migrate_id}'`);


            let response = await client.query(`SELECT a.*,c.district_id, c.name as district_name, d.block_code,block_name, e.panchayat_code, e.panchayat_name, f.statecode,f.statename, g.villagecode,villagename FROM migrate_data a
            inner join district_master c on a.district = c.district_id
            inner join block_master d on a.block = d.block_code
            left join state_master f on a.returningstate = f.statecode
            inner join gpmaster e on a.gp = e.panchayat_code
            inner join villagemaster g on a.village = g.villagecode
            
            where a.migrate_id='${migrate_id}'`);

            let response1 = await client.query(`SELECT * FROM migrate_skill_table_data  where migrate_id='${migrate_id}'`);
            var res = { details: response.rows[0], skilldatalist: response1.rows }


            resolve(res);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.allskillDataview = (migrate_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {

            let response = await client.query(`SELECT * FROM migrate_skill_table_data  where migrate_id='${migrate_id}'`);

            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}


exports.addResouresPersonData = (data) => {
    return new Promise(async (resolve, reject) => {

        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

        try {
            let findMaxQuery = '';
            let preMCode = '';

            findMaxQuery = `select max(cast(substr(id, 4, length(id)) as int )) from resource_person_data 
                    where substr(id, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let id = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`


            let queryText = `INSERT INTO resource_person_data(submittedby, id,dist,resourcetype,name,mobno,samiti,profession,areaofexpertise,workshop,remarks,registeredon)
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12)`;
            let values = [data.user_id, id, data.dist, data.resourceType, data.name, data.mobNo, data.samiti, data.profession, data.areaofExpertise, data.workshop, data.remarks, 'Now()'];


            let response = await client.query(queryText, values);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }



    });
}

exports.allResourseDataShow = (district_id, user_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });


        try {
            let response = await client.query(`SELECT  a.*, b.name as dist_name FROM resource_person_data  a 
                inner join district_master b on a.dist = b.district_id where a.submittedby='${user_id}' ORDER BY registeredon`);
            resolve(response.rows);


        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }


    });
}

exports.getresoursesdistwisedata = () => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM district_master   order by name ASC `);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}

exports.getresoursesDistWiseSamithiList = (dist_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT name,samithi_id FROM samithi where dist_id='${dist_id}'  order by name ASC `);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.getresoursesDistWiseSamithiList1 = (district_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT  name,samithi_id FROM samithi where dist_id='${district_id}'  order by name ASC`);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.getResoursesApplicationDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id FROM resource_person_data a 
           inner join district_master b on a.dist = b.district_id where id='${id}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}

exports.updateResoursesData = (id, data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });

        try {
            let response = await client.query(`UPDATE resource_person_data set dist = '${data.dist}',resourcetype = '${data.resourceType}', name = '${data.name}', mobno = '${data.mobNo}', samiti = '${data.samiti}', profession = '${data.profession}', areaofexpertise = '${data.areaofExpertise}', workshop = '${data.workshop}',remarks = '${data.remarks}',dataupdatedon = 'Now()'
                where id = '${id}' `);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }




    });

}
exports.oneResourceDataDeleted = (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM resource_person_data where id='${id}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.resourcePersonsDatashow = (id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id FROM resource_person_data a 
            inner join district_master b on a.dist = b.district_id where a.id='${id}'`);

            resolve(response.rows[0]);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}





exports.loadblock = (district_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.* FROM district_mapping_table a
            inner join block_master b on b.district_code = a.lgd_district_id where a.ss_district_id ='${district_id}' `);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
};
exports.loadgp = (block_code) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM gpmaster where block_code ='${block_code}' `);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
};
exports.loadVillages = (gp_code) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM villagemaster where gpcode ='${gp_code}' `);
            resolve(response.rows);
        } catch (e) {
            reject(e);
            throw e
        } finally {
            client.release();
        }
    });
};

exports.addSaiSabuJeemaData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });

        try {
            let findMaxQuery = '';
            let preMCode = '';

            findMaxQuery = `select max(cast(substr(sabujeema_id, 4, length(sabujeema_id)) as int )) from sai_sabujeema_data 
                    where substr(sabujeema_id, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let sabujeema_id = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`

            let queryText = `INSERT INTO sai_sabujeema_data( sabujeema_id,dist_id,samiti_id,bhajanmandali_id,noatindividualhousehold,noatcommunityplaces,noatssvip,notulshiplant,noneemplant,nosajanplant,noothersplant,nopreviousyearplant,photo,monthended,remarks,submittedby,registeredon)
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17)`;
            let values = [sabujeema_id, data.dist, data.samiti, data.bhajanMandali, data.noAtIndividualHousehold, data.noAtCommunityPlaces, data.noAtSsvip, data.noTulshiPlant, data.noNeemPlant, data.noSajanPlant, data.noOthersPlant, data.noPreviousYearPlant, data.idpUrl, data.monthEnded, data.remarks, data.user_id, 'Now()'];


            let response = await client.query(queryText, values);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }



    });
}

exports.saiSabujeemaAllDataShow = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

        try {
            let queryText;

            queryText = `SELECT  a.*, b.name as dist_name,c.name as samithi_name,d.bhajanmandali_name  FROM sai_sabujeema_data  a 
                    inner join district_master b on a.dist_id = b.district_id
                    inner join samithi c on a.samiti_id = c.samithi_id
                    left join bhajan_mandali d on a.bhajanmandali_id = d.bhajanmandali_id
                    where a.submittedby='${data.user_id}'  and registeredon >= '${new Date(data.fromDate).toDateString()}' and registeredon <= '${new Date(data.toDate).toDateString()}' `


            let response = await client.query(queryText);
            resolve(response.rows);

        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }

    });
}
exports.getSaiSabujeemaApplicationDetails = (sabujeema_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id, c.name as samithi_name, c.samithi_id FROM sai_sabujeema_data a 
           inner join district_master b on a.dist_id = b.district_id 
           inner join samithi c on a.samiti_id = c.samithi_id
           where sabujeema_id='${sabujeema_id}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.updateSaiSabuJeemaData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            if (data.idpUrl == undefined) {
                let response = await client.query(`UPDATE sai_sabujeema_data set dist_id = '${data.dist}',samiti_id = '${data.samiti}', bhajanmandali_id = '${data.bhajanMandali}', noatindividualhousehold = '${data.noAtIndividualHousehold}', noatcommunityplaces = '${data.noAtCommunityPlaces}', noatssvip = '${data.noAtSsvip}', notulshiplant = '${data.noTulshiPlant}', noneemplant = '${data.noNeemPlant}', nosajanplant = '${data.noSajanPlant}',noothersplant = '${data.noOthersPlant}',nopreviousyearplant = '${data.noPreviousYearPlant}',monthended = '${data.monthEnded}',remarks = '${data.remarks}',dataupdatedon = 'Now()'
                where sabujeema_id = '${data.sabujeema_id}' `);
                resolve(true);
            } else {
                let response = await client.query(`UPDATE sai_sabujeema_data set dist_id = '${data.dist}',samiti_id = '${data.samiti}', bhajanmandali_id = '${data.bhajanMandali}', noatindividualhousehold = '${data.noAtIndividualHousehold}', noatcommunityplaces = '${data.noAtCommunityPlaces}', noatssvip = '${data.noAtSsvip}', notulshiplant = '${data.noTulshiPlant}', noneemplant = '${data.noNeemPlant}', nosajanplant = '${data.noSajanPlant}',noothersplant = '${data.noOthersPlant}',nopreviousyearplant = '${data.noPreviousYearPlant}',monthended = '${data.monthEnded}', photo = '${data.idpUrl}',remarks = '${data.remarks}',dataupdatedon = 'Now()'
                where sabujeema_id = '${data.sabujeema_id}' `);
                resolve(true);

            }

        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }




    });

}
exports.saiSabujeemaDatashow = (sabujeema_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id,c.name as samithi_name,d.bhajanmandali_name FROM sai_sabujeema_data a 
           inner join district_master b on a.dist_id = b.district_id
           inner join samithi c on a.samiti_id = c.samithi_id
           left join bhajan_mandali d on a.bhajanmandali_id = d.bhajanmandali_id
           where sabujeema_id='${sabujeema_id}'`);
            resolve(response.rows[0]);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.bhajanMandaliListwiseData = (samithi_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM bhajan_mandali where samithi_id='${samithi_id}'  order by bhajanmandali_name ASC`);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.saiSabujeemaDataDeleted = (sabujeema_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM sai_sabujeema_data where sabujeema_id='${sabujeema_id}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.addBeneficiariesReportaData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });

        try {
            let findMaxQuery = '';
            let preMCode = '';

            findMaxQuery = `select max(cast(substr(beneficiariesreportid, 4, length(beneficiariesreportid)) as int )) from beneficiariesreport_data 
                    where substr(beneficiariesreportid, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let beneficiariesreportid = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`

            let queryText = `INSERT INTO beneficiariesreport_data( beneficiariesreportid,dist_id,samiti_id,dor,nameofbeneficiary,type,area,sector,specificscheme,actiondetails,approxexpenditureorganisation,approxexpenditurebeneficiary,monthlyincomeafterswabalambi,bankloan,nooffamilybenifited,photo1url,photo2url,remarks,submittedby,registeredon)
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`;
            let values = [beneficiariesreportid, data.dist, data.samiti, data.dor, data.nameOfbeneficiary, data.type, data.area, data.sector, data.specificScheme, data.actionDetails, data.approxExpenditureOrganisation, data.approxExpenditureBeneficiary, data.monthlyIncomeAfterSwabalambi, data.bankLoan, data.noOfFamilyBenifited, data.photo1, data.photo2, data.remarks, data.user_id, 'Now()'];


            let response = await client.query(queryText, values);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });
}
exports.beneficiariesReportAllData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let queryText;
            queryText = `SELECT  a.*, b.name as dist_name,c.name as samithi_name  FROM beneficiariesreport_data  a 
                    inner join district_master b on a.dist_id = b.district_id
                    inner join samithi c on a.samiti_id = c.samithi_id
                    where a.dist_id='${data.dist_id}'  and registeredon >= '${new Date(data.fromDate).toDateString()}' and registeredon <= '${new Date(data.toDate).toDateString()}' `


            let response = await client.query(queryText);
            resolve(response.rows);

        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }

    });
}

exports.getBeneficiariesReportApplicationDetails = (beneficiariesreportid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id, c.name as samithi_name, c.samithi_id FROM beneficiariesreport_data a 
           inner join district_master b on a.dist_id = b.district_id 
           inner join samithi c on a.samiti_id = c.samithi_id
           where beneficiariesreportid='${beneficiariesreportid}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.updateBeneficiariesReportData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`UPDATE beneficiariesreport_data set dist_id = '${data.dist}',samiti_id = '${data.samiti}',  dor = '${data.dor}', nameofbeneficiary = '${data.nameOfbeneficiary}', area = '${data.area}', sector = '${data.sector}', specificscheme = '${data.specificScheme}', actiondetails = '${data.actionDetails}',approxExpenditureOrganisation = '${data.approxExpenditureOrganisation}',approxexpenditurebeneficiary = '${data.approxExpenditureBeneficiary}',monthlyincomeafterswabalambi = '${data.monthlyIncomeAfterSwabalambi}', bankloan = '${data.bankLoan}', nooffamilybenifited = '${data.noOfFamilyBenifited}',photo1url = '${data.photo1}', photo2url = '${data.photo2}',type = '${data.type}',remarks = '${data.remarks}',dataupdatedon = 'Now()'
                where beneficiariesreportid = '${data.beneficiariesreportid}' `);
            resolve(true);



        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }




    });

}
exports.beneficiariesReportDatashow = (beneficiariesreportid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id,c.name as samithi_name FROM beneficiariesreport_data a 
           inner join district_master b on a.dist_id = b.district_id
           inner join samithi c on a.samiti_id = c.samithi_id
           where beneficiariesreportid='${beneficiariesreportid}'`);
            resolve(response.rows[0]);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.beneficiariesReportDataDeleted = (beneficiariesreportid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM beneficiariesreport_data where beneficiariesreportid='${beneficiariesreportid}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.addActivitiesReportaData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });

        try {
            let findMaxQuery = '';
            let preMCode = '';

            findMaxQuery = `select max(cast(substr(activitiesreportid, 4, length(activitiesreportid)) as int )) from activitiesreport_data 
                    where substr(activitiesreportid, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let activitiesreportid = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`

            let queryText = `INSERT INTO activitiesreport_data( activitiesreportid,dist_id,samiti_id,doa,type,activityrelated,actiondetails,participants,nameofresourceperson,followingperson,photo1url,photo2url,remarks,submittedby,registeredon)
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15)`;
            let values = [activitiesreportid, data.dist, data.samiti, data.doa, data.type, data.activityRelated, data.actionDetails, data.participants, data.nameOfResourcePerson, data.followingPerson, data.photo1, data.photo2, data.remarks, data.user_id, 'Now()'];


            let response = await client.query(queryText, values);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });
}
exports.activitiesReportAllData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });

        try {
            let queryText;

            queryText = `SELECT  a.*, b.name as dist_name,c.name as samithi_name  FROM activitiesreport_data  a 
                    inner join district_master b on a.dist_id = b.district_id
                    inner join samithi c on a.samiti_id = c.samithi_id
                    where a.submittedby='${data.user_id}'  and registeredon >= '${new Date(data.fromDate).toDateString()}' and registeredon <= '${new Date(data.toDate).toDateString()}' `


            let response = await client.query(queryText);
            resolve(response.rows);

        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }

    });
}
exports.getActivitiesReportApplicationDetails = (activitiesreportid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id, c.name as samithi_name, c.samithi_id FROM activitiesreport_data a 
           inner join district_master b on a.dist_id = b.district_id 
           inner join samithi c on a.samiti_id = c.samithi_id
           where activitiesreportid='${activitiesreportid}'`);
            resolve(response.rows);

        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.updateActivitiesReportData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`UPDATE activitiesreport_data set dist_id = '${data.dist}',samiti_id = '${data.samiti}',  doa = '${data.doa}',type = '${data.type}', activityrelated = '${data.activityRelated}', actiondetails = '${data.actionDetails}',participants = '${data.participants}',nameOfresourceperson = '${data.nameOfResourcePerson}',followingperson = '${data.followingPerson}',photo1url = '${data.photo1}', photo2url = '${data.photo2}',remarks = '${data.remarks}',dataupdatedon = 'Now()'
                where activitiesreportid = '${data.activitiesreportid}' `);
            resolve(true);



        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }




    });

}
exports.activitiesReporttDatashow = (activitiesreportid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT a.*, b.name as dist_name, b.district_id,c.name as samithi_name FROM activitiesreport_data a 
           inner join district_master b on a.dist_id = b.district_id
           inner join samithi c on a.samiti_id = c.samithi_id
           where activitiesreportid='${activitiesreportid}'`);
            resolve(response.rows[0]);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.activitiesReportDataDeleted = (activitiesreportid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`DELETE FROM activitiesreport_data where activitiesreportid='${activitiesreportid}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.getLevel = () => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM lavel `);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.getDesignationList = (lavel_id) => {
    return new Promise(async resolve => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM designation_table where lavel_id='${lavel_id}' `);
            resolve(response.rows);
        } catch (e) {
            resolve([]);
            throw e
        } finally {
            client.release();
        }
    });
}
exports.addofficeBearersInformationData = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {
            let findMaxQuery = '';
            let preMCode = '';
            findMaxQuery = `select max(cast(substr(officebearersinformationid, 4, length(officebearersinformationid)) as int )) from bearersinformation_data 
                    where substr(officebearersinformationid, 1, 2) = '${data.dist_id}'`;
            preMCode = `${data.dist_id}`

            let maxResponse = await client.query(findMaxQuery);
            let officebearersinformationid = maxResponse.rows[0].max == null ? `${preMCode}-1` : `${preMCode}-${maxResponse.rows[0].max + 1}`

            let queryText = `INSERT INTO bearersinformation_data( officebearersinformationid,level,district,samiti,bhajanmandali,designation,nameofbearers,age,qualification,profession,mobno,wpno,email,saiid,yearofjoining,howmanyyearofjoin,responsibility,alumni,passportphoto,submittedby,registeredon)
                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14,$15, $16, $17, $18, $19,$20,$21,$22)`;
            let values = [officebearersinformationid, data.level, data.district, data.samiti, data.bhajanMandali, data.designation, data.nameOfBearers, data.age, data.qualification, data.profession, data.mobNo, data.wpNo, data.email, data.saiId, data.yearOfJoining, data.howManyYearOfJoin, data.responsibility, data.alumni, data.passportPhoto, data.user_id, 'Now()'];

            let queryText2 = `insert into join_prasanthi_seva_data(officebearersinformationid, joinprasanthiseva) values `;
            data.joinPrasanthiSeva.forEach(element => {
                queryText2 += `('${officebearersinformationid}', '${element.joinprasanthiseva}'), `;
            })

            let addIndentDesc = client.query(queryText2.substring(0, queryText2.length - 2));
            await addIndentDesc;


            let response = await client.query(queryText, values);
            resolve(true);
        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }
    });
}
exports.getCampById = (campid) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT * FROM campdetails where campid='${campid}'`);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}
exports.updateCampDetails1 = (data) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { resolve("Database Connection Error!!!!!") });
        try {

            let response = await client.query(`UPDATE campdetails set cmpplace = '${data.cmpPlace}',  dist = '${data.dist}',cmpaddress = '${data.cmpAddress}', cmpnodonors = '${data.cmpNoDonors}', cmpdate = '${data.cmpDate}',campdateto= '${data.cmpDateTo}',cmpremark = '${data.cmpRemark}',idpurl = '${data.idpUrl}',dataupdatedon = 'Now()'
            where campid = '${data.campid}' `);
            resolve(true);

        } catch (e) {
            reject(e);
            throw e;
        } finally {
            client.release();
        }




    });

}
exports.loadDonerId = (district_id) => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect().catch(e => { reject("Database Connection Error!!!!!") });
        try {
            let response = await client.query(`SELECT donerid FROM donordetails where district = '${district_id}' `);
            resolve(response.rows);
        } catch (e) {
            reject(e);

            throw e
        } finally {
            client.release();
        }
    });
}