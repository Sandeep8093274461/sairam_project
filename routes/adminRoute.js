var express = require('express');
var router = express.Router();
//var multer = require('multer');
var path1 = require('path');
var multer1 = require('multer');
const sha256 = require('sha256');



var actsPublicBal = require('../models/BAL/PublicBal');
module.exports = router;


let storage1 = multer1.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        var d = new Date();
        cb(null, file.originalname.replace(path1.extname(file.originalname), "") + '-' + d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + path1.extname(file.originalname))
    }
})

let upload1 = multer1({ storage: storage1 })





router.get('/downloadFile/:filanm', (req, res) => {
    res.download('./uploads/' + req.params.filanm);
})

router.get('/downloadFilejson/:filanm', (req, res) => {

    var jsonobj = JSON.parse(req.params.filanm);

    res.download('./uploads/' + jsonobj.campFile);
})

router.post('/savedata1', upload1.single('file'), function (req, res, next) {
    let dd = req.body;
    res.send({ "statusCode": 200, "statusMessage": "file uploaded successfully!" });
});

router.get('/getCDAte', (req, res) => {

    var hw = encrypt("111")
    var ff = decrypt(hw)

    res.send(new Date());
});
router.get('/getActiveDangerZone', async (req, res) => {
    try {
        let result1 = actsPublicBal.getActiveDangerZone();
        let result2 = await actsPublicBal.getActiveDangerContactZone();
        let result = await result1;
        res.send(result.concat(result2));
    } catch (e) {
        console.log(e);
    }
});
router.get('/getActiveWarningZone', async (req, res) => {
    let result = await actsPublicBal.getActiveWarningZone();
    res.send(result)
});
router.get('/getDateWiseDangerZoneTimeLineData', async (req, res) => {
    let result1 = actsPublicBal.getDateWiseDangerZoneTimeLineData(req.query.fromDate, req.query.toDate);
    let result2 = await actsPublicBal.getDateWiseDangerContactZoneTimeLineData(req.query.fromDate, req.query.toDate);
    let result = await result1;
    res.send(result.concat(result2));
});
router.get('/getDateWiseWarningZoneTimeLineData', async (req, res) => {
    let result = await actsPublicBal.getDateWiseWarningZoneTimeLineData(req.query.fromDate, req.query.toDate);
    res.send(result)
});
router.get('/getAllInfectedSources', async (req, res) => {
    let result = await actsPublicBal.getAllInfectedSources();
    res.send(result);
});
router.get('/getInfectedSourcesDateWise', async (req, res) => {
    let result = await actsPublicBal.getInfectedSourcesDateWise(req.query.mode, req.query.fromDate, req.query.toDate);
    res.send(result)
});
router.get('/getNoOfAvlPatient', async (req, res) => {
    let result = await actsPublicBal.getNoOfAvlPatient();
    res.send(result)
});
router.get('/getPatientDetails', async (req, res) => {
    let result = await actsPublicBal.getPatientList();
    var generateResponse = [];

    var resultArray = [];
    resultArray.push(result);
    var innerarr = resultArray[0];
    var Type_of_transmissionLst = innerarr.map(item => item.Type_of_transmission).filter((value, index, self) => self.indexOf(value) === index)

    for (var i = 0; i < Type_of_transmissionLst.length; i++) {
        var TypeTransmission = Type_of_transmissionLst[i];
        var TypeTransmissionCount = innerarr.filter(function (item) { return (item.Type_of_transmission == TypeTransmission); });
        var ll = TypeTransmissionCount.length;

        if (TypeTransmission == 'TBD') {
            TypeTransmission = 'To be declared'
        }

        generateResponse.push({
            TypeTransmission: TypeTransmission,
            TypeTransmissionCount: TypeTransmissionCount.length,
            TypeOfTransmission: TypeTransmission,
        });
    }


    res.send(generateResponse)
});

router.get('/getStateWisePatientDetails', async (req, res) => {
    let result = await actsPublicBal.getPatientList();

    var resultArray = [];
    resultArray.push(result);
    var innerarr = resultArray[0];
    var stateResponse = [];
    var StateLst = innerarr.map(item => item.Detected_State).filter((value, index, self) => self.indexOf(value) === index)

    for (var i = 0; i < StateLst.length; i++) {
        var State = StateLst[i];
        var StateCount = innerarr.filter(function (item) { return (item.Detected_State == State); });


        stateResponse.push({
            StateName: State,
            CoronaCount: StateCount.length
        });
    }
    res.send(stateResponse)
});

router.post('/addDonorDetails', async (req, res) => {

    let result = await actsPublicBal.addBloodGroup(req.body);
    res.send(result);
});
router.post('/addDonorDetails1', async (req, res) => {

    let result = await actsPublicBal.addBloodGroup(req.body.data);
    res.send(result);
});

router.post('/addUserDetails', async (req, res) => {
    req.body.data.credential = encrypt(req.body.data.credential);
    let result = await actsPublicBal.addUserDetails(req.body.data);
    res.send(result);
});
router.post('/addDonoationDetails', async (req, res) => {

    let result = await actsPublicBal.addDonoationDetails(req.body.data);
    res.send(result);
});

router.post('/addCampDetails', async (req, res) => {

    let result = await actsPublicBal.addCampDetails(req.body);
    res.send(result);
});
router.post('/addCampDetails1', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'idp', maxCount: 1 }
        ]);

        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.idp != undefined) {
                mdata.idpUrl = req.files.idp[0].path.replace('public', '../..');
            }

            let result = await actsPublicBal.addCampDetails(mdata);
            res.send(result);
        })
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/updateCampDetails1', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'idp', maxCount: 1 }
        ]);

        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.idp != undefined) {
                mdata.idpUrl = req.files.idp[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.updateCampDetails1(mdata);
            res.send(result);
        })
    } catch (e) {
        res.status(500).send(e);
    }
})
// router.post('/addCampDetails1', upload1.array('files'), (req, res, next) => {

//     var jsondt = JSON.parse(req.body.data);
//     let result = actsPublicBal.addCampDetails(jsondt);
//     res.send(result);
// });

router.get('/getDonorDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getDonorList();
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/getIndividualDonorDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getIndividualDonorDetails(req.body);
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/donorDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.donorDataDeleted(req.query.donerid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
    // let result = await actsPublicBal.getDonorList();
    // res.send(result)
});

router.get('/getCampDetails', async (req, res) => {
    let result = await actsPublicBal.getCampList();
    var generateResponse = [];

    var resultArray = [];
    resultArray.push(result);
    var innerarr = resultArray[0];
    var Type_of_campLst = innerarr.map(item => item.cmpOrgCode).filter((value, index, self) => self.indexOf(value) === index)
    var Type_of_campId = innerarr.map(item => item.campId).filter((value, index, self) => self.indexOf(value) === index)

    for (var i = 0; i < Type_of_campLst.length; i++) {
        var campLst = Type_of_campLst[i];

        var campId = Type_of_campLst[i];


        generateResponse.push({
            campId: campId,
            cmpOrgCode: campLst,
        });
    }


    res.send(generateResponse)
});


router.post('/updateDonor', async (req, res) => {
    let result = await actsPublicBal.updateDonor(req.body.donorId, req.body.data);
    res.send(result);
});

router.post('/removeDonor', async (req, res) => {
    let result = await actsPublicBal.removeDonor(req.body);
    res.send(result);
});

router.get('/getDonorById', async (req, res) => {
    try {
        let result = await actsPublicBal.getDonorById(req.query.donerid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/getDonationById/:donorId', async (req, res) => {
    let result = await actsPublicBal.getDonationById(req.params.donorId);
    res.send(result);
});

router.post('/changeMyUpdates', async (req, res) => {
    let result = await actsPublicBal.changeMyUpdates(req.body.condition, req.body.newValue, req.body.collectionName);
    res.send(result);
});
router.post('/changeMyUpdates1', async (req, res) => {
    // let result = await actsPublicBal.changeMyUpdates(req.body.data.condition, req.body.data.newValue, req.body.data.collectionName);
    // res.send(result);
    try {
        let result = await actsPublicBal.changeMyUpdates(req.body.donerid, req.body.updateData, req.body.previousLastDonationDate);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/changeUserUpdates1', async (req, res) => {
    req.body.data.newValue.credential = encrypt(req.body.data.newValue.credential);
    let result = await actsPublicBal.changeMyUpdates(req.body.data.condition, req.body.data.newValue, req.body.data.collectionName);
    res.send(result);
});

router.post('/changeUserUpdates', async (req, res) => {

    let result;
    let res1 = await actsPublicBal.getUserMail(req.body.data.newValue.email);

    if (res1.length > 0) {
        if (req.body.data.newValue.email == res1[0].email) {
            if (req.body.data.newValue.squestion == res1[0].squestion) {
                if (req.body.data.newValue.sanswer == res1[0].sanswer) {
                    req.body.data.newValue.credential = encrypt(req.body.data.newValue.credential);
                    result = await actsPublicBal.changeMyUpdates(req.body.data.condition, req.body.data.newValue, req.body.data.collectionName);
                    if (result) {
                        result = [{ msg: 'Password Successfully updated. Please log in' }];
                    }
                }
                else {
                    result = [{ msg: 'Your security question/answer is not matching' }];
                }
            }
            else {
                result = [{ msg: 'Your security question/answer is not matching' }];
            }
        }
        else {
            result = [{ msg: 'Your email is not registered' }];
        }
    }
    else {
        result = [{ msg: 'Your email is not registered' }];
    }
    res.send(result);
});

router.post('/removeMyDocument', async (req, res) => {
    let result = await actsPublicBal.removeMyDocument(req.body.condition, req.body.collectionName);
    res.send(result);
});
router.post('/insertMyDocuments', async (req, res) => {
    let result = await actsPublicBal.insertMyDocuments(req.body.data, req.body.collectionName);
    res.send(result);
});
router.get('/getUserDetails/:un', async (req, res) => {
    let result;
    if (req.params.un == 'ADMIN') {
        result = await actsPublicBal.getUserListTotal();
    }
    else {
        result = await actsPublicBal.getUserList(req.params.un);
    }


    res.send(result)
});
router.post('/getDonorFilterList', async (req, res) => {
    try {
        let result = await actsPublicBal.getDonorFilterList(req.body);
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }

    // var generateResponse = [];

    // var resultArray = [];
    // resultArray.push(result);
    // var innerarr = result;

    // for (var i = 0; i < innerarr.length; i++) {
    //     var nnn = innerarr[i].name;
    //     var donationDate = innerarr[i].lastDonationDate;
    //     var today = new Date();
    //     var inpdt = new Date(donationDate);
    //     var Difference_In_Time = today.getTime() - inpdt.getTime();
    //     var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    //     if (Difference_In_Days > 120) {
    //         delete innerarr[i];
    //     }
    // }


    // res.send(innerarr)
});



router.post('/getCmpDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getCampList(req.body);
        res.send(result)
    }
    catch (e) {
        res.status(500).send(e);
    }

});

router.post('/campUpdateDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.campUpdateDataDeleted(req.body.campid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/getUserMail/:mail', async (req, res) => {


    let result = await actsPublicBal.getUserMail(req.params.mail);
    var mail = result[0].email;
    var cred = result[0].credential;
    //send mail start


    //send mail end
    res.send(result)
});


router.post('/removeMyDocumentDB', async (req, res) => {
    let result = await actsPublicBal.removeMyDocumentDB(req.body.condition, req.body.collectionName);
    res.send(result);
});

router.post('/changeMyUpdatesDB', async (req, res) => {
    let result = await actsPublicBal.changeMyUpdatesDB(req.body.condition, req.body.newValue, req.body.collectionName);
    res.send(result);
});

router.get('/getCampById', async (req, res) => {
    try {
        let result = await actsPublicBal.getCampById(req.query.campid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

    // let result = await actsPublicBal.getCmpById(req.params.campId);
    // res.send(result);
});

router.get('/getUserById/:id', async (req, res) => {
    let result = await actsPublicBal.getUserById(req.params.id);
    result[0].credential = decrypt(result[0].credential);
    res.send(result);
});


router.post('/validateUserLogin', async (req, res) => {
    actsPublicBal.getUserDetails(req.body.userdetails.username, function (response) {
        if (response.length == 0) {
            let response1 = [{
                "validated": 0
            }];
            res.send(response1)

        }
        else {
            if (sha256(response[0].password) == req.body.userdetails.password) {
                req.session.userId = response[0].user_id;
                req.session.role = response[0].role;
                req.session.district_id = response[0].district_id;
                req.session.user_id = response[0].user_id;
                let response1 = [];

                switch (response[0].role) {
                    case 'USER': {
                        req.session.role = "USER";
                        req.session.district_id = response[0].district_id;
                        response1.push({
                            "validated": 2
                        });
                        break;
                    }
                    case 'ADMIN': {
                        req.session.role = "ADMIN";
                        response1.push({
                            "validated": 1
                        });
                        break;
                    }
                }
                res.send(response1);

            }
            else {
                let response1 = [{
                    "validated": 0
                }];
                res.send(response1)
            }
        }
    });
});
router.post('/changePassword', async (req, res) => {
    actsPublicBal.getUserDetails(req.body.user_id, async (response) => {
        if (response.length == 0) {
            res.status(500).send("Wrong credetional1.");
        }
        else {
            if (sha256(response[0].password) == req.body.oldPass) {
                try {
                    await actsPublicBal.changePassword(req.body.user_id, req.body.newPass);
                    res.send(true);
                } catch (e) {
                    res.status(500).send(e);
                }
            }
            else {
                res.status(500).send("Wrong credetional.");
            }
        }
    });
});

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
function encrypt(text) {
    //let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let cipher = crypto.createCipher('aes-256-cbc', '123qwe678')
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    //let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    //let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decipher = crypto.createDecipher('aes-256-cbc', '123qwe678')
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}



router.post('/addConvenor', upload1.array('files'), async (req, res, next) => {
    var jsondt = JSON.parse(req.body.data);
    if (req.files != 0) {
        jsondt.photo2 = req.files[0].path.replace('public/', './');
    }
    try {
        let result = await actsPublicBal.addConvenorDetails(jsondt);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.get('/getConvenorDetails/:un', async (req, res) => {

    if (req.session.usernm) {
        alert(req.session.usernm);
    }
    let result = await actsPublicBal.getConvenorList();
    // if (req.params.un == 'ADMIN') {
    //     result = await actsPublicBal.getConvenorList();
    // }
    // else {
    //     result = await actsPublicBal.getConvenorListun(req.params.un);
    // }


    res.send(result)
});

router.get('/getConvenorDetailsId/:convId', async (req, res) => {
    let result = await actsPublicBal.getConvenorDetailsId(req.params.convId);
    res.send(result);
});


router.get('/getConvenordatadist', async (req, res) => {

    if (req.session.usernm) {
        alert(req.session.usernm);
    }
    let result;
    result = await actsPublicBal.getConvenordatadist();
    res.send(result)
});
router.get('/getDistWiseSamithiList/:dist', async (req, res) => {
    try {
        let result = await actsPublicBal.getDistWiseSamithiList(req.params.dist);
        res.send(result)
    } catch (e) { }
})
router.post('/removeSevaData/:convid', async (req, res) => {
    try {
        let result = await actsPublicBal.removeSevaData(req.params.convid);
        res.send(result)
    } catch (e) { }
});

router.get('/getConvenordatadistdistinct', async (req, res) => {

    if (req.session.usernm) {
        alert(req.session.usernm);
    }
    let result = await actsPublicBal.getConvenordatadist();
    // var lookup = {};
    // var resultnew = [];

    // for (var item, i = 0; item = result[i++];) {
    //     var name = item.District;

    //     if (!(name in lookup)) {
    //         lookup[name] = 1;
    //         resultnew.push({
    //             districtName: name
    //         });
    //     }
    // }

    res.send(result)
});



router.get('/getConvenordatadist/:dist', async (req, res) => {

    if (req.session.usernm) {
        alert(req.session.usernm);
    }

    var distcon = req.params.dist;

    let result;
    result = await actsPublicBal.getSevaSamitiList(distcon);

    // var newresult = result.filter(function (el) {
    //     return el.District.toUpperCase().includes(distcon.toUpperCase()) == true; // Changed this so a home would match
    // });

    res.send(result)
});

router.get('/getConvenordataSamiti/:samiti', async (req, res) => {

    if (req.session.usernm) {
        alert(req.session.usernm);
    }

    var distsamiti = req.params.samiti;

    let result;
    result = await actsPublicBal.getConvenordatadist();

    var newresult = result.filter(function (el) {
        return el.SevaSamithi == distsamiti; // Changed this so a home would match
    });

    res.send(newresult)
});

router.post('/getFilteredConvenorData', async (req, res) => {
    try {
        let result = await actsPublicBal.getFilteredConvenorData(req.body);
        res.send(result)
    } catch (e) {

    }
});


router.post('/addMigrateData', async (req, res) => {
    try {
        let result = await actsPublicBal.addMigrateData(req.body);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
})
router.get('/allSkillDataShow', async (req, res) => {
    try {

        let result = await actsPublicBal.allSkillDataShow(req.query.district_id, req.query.user_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/getApplicationDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getApplicationDetails(req.query.migrate_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.post('/updateMigrateData', async (req, res) => {
    try {
        let result = await actsPublicBal.updateMigrateData(req.body.migrate_id, req.body.updateData, req.body.district_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});


router.post('/oneDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.oneDataDeleted(req.body.migrate_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.post('/skillCheck', async (req, res) => {
    try {
        let result = await actsPublicBal.skillCheck();
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.get('/state', async (req, res) => {
    try {
        let result = await actsPublicBal.getStates();
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/allMigrantDatashow', async (req, res) => {
    try {
        let result = await actsPublicBal.allMigrantDatashow(req.query.migrate_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/allskillDataview', async (req, res) => {
    try {
        let result = await actsPublicBal.allskillDataview(req.query.migrate_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});


router.post('/addResouresPersonData', async (req, res) => {
    try {
        let result = await actsPublicBal.addResouresPersonData(req.body);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.get('/allResourseDataShow', async (req, res) => {
    try {
        let result = await actsPublicBal.allResourseDataShow(req.query.district_id, req.query.user_id);

        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/getresoursesdistwisedata', async (req, res) => {
    result = await actsPublicBal.getresoursesdistwisedata();
    res.send(result)
});

router.get('/getresoursesDistWiseSamithiList', async (req, res) => {
    try {
        let result = await actsPublicBal.getresoursesDistWiseSamithiList(req.query.dist_id);
        res.send(result)
    } catch (e) { }
})
router.get('/getresoursesDistWiseSamithiList1', async (req, res) => {
    try {
        let result = await actsPublicBal.getresoursesDistWiseSamithiList1(req.query.district_id);
        res.send(result)
    } catch (e) { }
})
router.get('/getResoursesApplicationDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getResoursesApplicationDetails(req.query.id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/updateResoursesData', async (req, res) => {
    try {
        let result = await actsPublicBal.updateResoursesData(req.body.id, req.body.updateData);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.post('/oneResourceDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.oneResourceDataDeleted(req.body.id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/resourcePersonsDatashow', async (req, res) => {
    try {
        let result = await actsPublicBal.resourcePersonsDatashow(req.query.id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/loadblock', async (req, res) => {
    try {
        let result = await actsPublicBal.loadblock(req.query.district_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/loadgp', async (req, res) => {
    try {
        let result = await actsPublicBal.loadgp(req.query.block_code);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/loadVillages', async (req, res) => {
    try {
        let result = await actsPublicBal.loadVillages(req.query.gp_code);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/addSaiSabuJeemaData', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'idp', maxCount: 1 }
        ]);

        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.idp != undefined) {
                mdata.idpUrl = req.files.idp[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.addSaiSabuJeemaData(mdata);
            res.send(result);
        })
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/saiSabujeemaAllDataShow', async (req, res) => {
    try {
        let result = await actsPublicBal.saiSabujeemaAllDataShow(req.body);
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});


router.get('/getSaiSabujeemaApplicationDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getSaiSabujeemaApplicationDetails(req.query.sabujeema_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/updateSaiSabuJeemaData', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'idp', maxCount: 1 }
        ]);
        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.idp != undefined) {
                mdata.idpUrl = req.files.idp[0].path.replace('public', '../..');

            }
            let result = await actsPublicBal.updateSaiSabuJeemaData(mdata);
            res.send(result);


        })


        // let result = await actsPublicBal.updateSaiSabuJeemaData(req.body.id, req.body.updateData);
        // res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.get('/saiSabujeemaDatashow', async (req, res) => {
    try {
        let result = await actsPublicBal.saiSabujeemaDatashow(req.query.sabujeema_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/bhajanMandaliListwiseData', async (req, res) => {
    try {
        let result = await actsPublicBal.bhajanMandaliListwiseData(req.query.samithi_id);
        res.send(result)
    } catch (e) { }
})
router.post('/saiSabujeemaDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.saiSabujeemaDataDeleted(req.body.sabujeema_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});


router.post('/addBeneficiariesReportaData', async (req, res) => {
    try {

        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'photo1', maxCount: 1 },
            { name: 'photo2', maxCount: 1 }
        ]);


        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.photo1 != undefined) {
                mdata.photo1 = req.files.photo1[0].path.replace('public', '../..');
            }
            if (req.files.photo2 != undefined) {
                mdata.photo2 = req.files.photo2[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.addBeneficiariesReportaData(mdata);
            res.send(result);
        })
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})
router.post('/beneficiariesReportAllData', async (req, res) => {
    try {
        let result = await actsPublicBal.beneficiariesReportAllData(req.body);
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/getBeneficiariesReportApplicationDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getBeneficiariesReportApplicationDetails(req.query.beneficiariesreportid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/updateBeneficiariesReportData', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'photo1', maxCount: 1 },
            { name: 'photo2', maxCount: 1 }
        ]);

        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.photo1 != undefined) {
                mdata.photo1 = req.files.photo1[0].path.replace('public', '../..');
            }
            if (req.files.photo2 != undefined) {
                mdata.photo2 = req.files.photo2[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.updateBeneficiariesReportData(mdata);
            res.send(result);


        })


        // let result = await actsPublicBal.updateSaiSabuJeemaData(req.body.id, req.body.updateData);
        // res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/beneficiariesReportDatashow', async (req, res) => {
    try {
        let result = await actsPublicBal.beneficiariesReportDatashow(req.query.beneficiariesreportid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/beneficiariesReportDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.beneficiariesReportDataDeleted(req.body.beneficiariesreportid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.post('/addActivitiesReportaData', async (req, res) => {
    try {

        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'photo1', maxCount: 1 },
            { name: 'photo2', maxCount: 1 }
        ]);


        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.photo1 != undefined) {
                mdata.photo1 = req.files.photo1[0].path.replace('public', '../..');
            }
            if (req.files.photo2 != undefined) {
                mdata.photo2 = req.files.photo2[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.addActivitiesReportaData(mdata);
            res.send(result);
        })
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})
router.post('/activitiesReportAllData', async (req, res) => {
    try {
        let result = await actsPublicBal.activitiesReportAllData(req.body);
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/getActivitiesReportApplicationDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getActivitiesReportApplicationDetails(req.query.activitiesreportid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/updateActivitiesReportData', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'photo1', maxCount: 1 },
            { name: 'photo2', maxCount: 1 }
        ]);

        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.photo1 != undefined) {
                mdata.photo1 = req.files.photo1[0].path.replace('public', '../..');
            }
            if (req.files.photo2 != undefined) {
                mdata.photo2 = req.files.photo2[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.updateActivitiesReportData(mdata);
            res.send(result);


        })
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/activitiesReportDatashow', async (req, res) => {
    try {
        let result = await actsPublicBal.activitiesReportDatashow(req.query.activitiesreportid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/activitiesReportDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.activitiesReportDataDeleted(req.body.activitiesreportid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.get('/getLevel', async (req, res) => {
    result = await actsPublicBal.getLevel();
    res.send(result)
});
router.get('/getDesignationList', async (req, res) => {
    try {
        let result = await actsPublicBal.getDesignationList(req.query.lavel_id);
        res.send(result)
    } catch (e) { }
})
router.post('/addofficeBearersInformationData', async (req, res) => {
    try {

        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'passportPhoto', maxCount: 1 }
        ]);


        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.passportPhoto != undefined) {
                mdata.passportPhoto = req.files.passportPhoto[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.addofficeBearersInformationData(mdata);
            res.send(result);
        })
    } catch (e) {
        console.log(e)
        res.status(500).send(e);
    }
})
router.post('/officeBearersInformationAllData', async (req, res) => {
    try {
        let result = await actsPublicBal.officeBearersInformationAllData(req.body);
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/getOfficeBearersInformationDetails', async (req, res) => {
    try {
        let result = await actsPublicBal.getOfficeBearersInformationDetails(req.query.officebearersinformationid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.post('/updateOfficeBearersInformationData', async (req, res) => {
    try {
        let Storage = multer1.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads/documents');
            },
            filename: function (req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path1.extname(file.originalname));
            }
        });
        let fileFilter = (req, file, callback) => {
            if (file.mimetype == 'application/pdf' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png') {
                callback(null, true);
            } else {
                callback(new Error('File Format Should be PDF or Image'));
            }
        }

        var upload = multer1({ storage: Storage, fileFilter: fileFilter }).fields([
            { name: 'passportPhoto', maxCount: 1 }
        ]);

        upload(req, res, async err => {
            if (err) throw err;
            let mdata = JSON.parse(req.body.Name1);

            if (req.files.passportPhoto != undefined) {
                mdata.passportPhoto = req.files.passportPhoto[0].path.replace('public', '../..');
            }
            let result = await actsPublicBal.updateOfficeBearersInformationData(mdata);
            res.send(result);


        })
    } catch (e) {
        res.status(500).send(e);
    }

});
router.post('/officeBearersInformationDataDeleted', async (req, res) => {
    try {
        let result = await actsPublicBal.officeBearersInformationDataDeleted(req.body.officebearersinformationid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});
router.get('/officeBearersInformationshow', async (req, res) => {
    try {
        let result = await actsPublicBal.officeBearersInformationshow(req.query.officebearersinformationid);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/addNewDistrict', async (req, res) => {
    try {
        let result = await actsPublicBal.addNewDistrict(req.body);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/addNewSamiti', async (req, res) => {
    try {
        let result = await actsPublicBal.addNewSamiti(req.body);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
})
router.post('/addNewBm', async (req, res) => {
    try {
        let result = await actsPublicBal.addNewBm(req.body);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.get('/validateDistrict', async (req, res) => {
    try {
        let result = await actsPublicBal.validateDistrict(req.query.newDistrictName);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/validateSamiti', async (req, res) => {
    try {
        let result = await actsPublicBal.validateSamiti(req.query);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/validateBm', async (req, res) => {
    try {
        let result = await actsPublicBal.validateBm(req.query);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/loadDonerId', async (req, res) => {
    try {
        let result = await actsPublicBal.loadDonerId();
        res.send(result)
    } catch (e) {
        res.status(500).send(e);
    }
});
router.get('/convenorDetailsData', async (req, res) => {
    try {
        let result = await actsPublicBal.convenorDetailsData(req.query.conv_id);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/changeMyUpdatesDB1', upload1.array('files'), async (req, res, next) => {
    var jsondt = JSON.parse(req.body.data);
    if (req.files != 0) {
        jsondt.photo2 = req.files[0].path.replace('public/', './');
    }
    try {
        let result = await actsPublicBal.changeMyUpdatesDB(jsondt);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }

});

