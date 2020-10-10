var express = require('express');
var router = express.Router();
var permission = require('../models/permission');
var path = require('path');

const sha256 = require('sha256');

var actsAdminBal = require('../models/BAL/AdminBal');
module.exports = router;
var actsPublicBal = require('../models/BAL/PublicBal');

router.get('/login', (req, res) => {
    res.sendFile(path.resolve('./public/loginPage.html'));
})

router.get('/convernorData', permission.permission("ADMIN"), function (req, res, next) {
    res.render('views/admin/CovidSevaReport', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,conv_id: req.query.conv_id });
});
router.get('/convenorDetails', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/covidSeva', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, conv_id: req.query.conv_id });
});
router.get('/changePassword', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/changePassword', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role })
});
router.get('/migrantSurvey', permission.permission("ADMIN"), (req, res) => {
    console.log(req.query.migrate_id)
    res.render('views/admin/migrantSurvey', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, migrate_id: req.query.migrate_id })
});
router.get('/migrantAllData', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/migrantAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, migrate_id: req.query.migrate_id })
});
router.get('/migrantSurveyViewPage', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/migrantSurveyViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, migrate_id: req.query.migrate_id })
});
router.get('/resourcePersons', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/resourcePersons', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, id: req.query.id })
});
router.get('/resourcePersonsAllData', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/resourcePersonsAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, id: req.query.id })
});
router.get('/resourcePersonsViewPage', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/resourcePersonsViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, id: req.query.id })
});
router.get('/saiSabujeema', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/saiSabujeema', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, sabujeema_id: req.query.sabujeema_id })
});
router.get('/saiSabujeemaAllData', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/saiSabujeemaAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, sabujeema_id: req.query.sabujeema_id })
});
router.get('/saiSabujeemaViewPage', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/saiSabujeemaViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, sabujeema_id: req.query.sabujeema_id })
});
router.get('/beneficiariesReport', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/beneficiariesReport', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , beneficiariesreportid: req.query.beneficiariesreportid })
});
router.get('/beneficiariesReportAllData', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/beneficiariesReportAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , beneficiariesreportid: req.query.beneficiariesreportid })
});
router.get('/beneficiariesReportViewPage', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/beneficiariesReportViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , beneficiariesreportid: req.query.beneficiariesreportid })
});
router.get('/activitiesReport', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/activitiesReport', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , activitiesreportid : req.query.activitiesreportid  })
});
router.get('/activitiesReportAllData', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/activitiesReportAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , activitiesreportid : req.query.activitiesreportid  })
});
router.get('/activitiesReportViewPage', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/activitiesReportViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , activitiesreportid : req.query.activitiesreportid  })
});
router.get('/officeBearersInformation', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/officeBearersInformation', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , officebearersinformationid : req.query.officebearersinformationid })
});
router.get('/officeBearersInformationAllData', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/officeBearersInformationAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , officebearersinformationid : req.query.officebearersinformationid })
});
router.get('/officeBearersInformationViewPage', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/officeBearersInformationViewPage',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , officebearersinformationid : req.query.officebearersinformationid })
});
router.get('/addDistrict', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/addDistrict',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role  })
});
router.get('/addSamiti', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/addSamiti',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role  })
});
router.get('/addBm', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/addBm',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role  })
});
router.get('/addDonation', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/addDonation',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/detailsDonor', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/detailsDonor',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});

router.get('/donorReport', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/donorReport',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/detailsCamp', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/detailsCamp',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,campid : req.query.campid  })
});
router.get('/campUpdate', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/campUpdate',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,campid : req.query.campid  })
});
router.get('/donorFilter', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/donorFilter',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/detailsDonation', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/detailsDonation',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/password', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/password',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/addDistricts', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/addDistricts',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/individualDonorReport', permission.permission("ADMIN"), (req, res) => {
    res.render('views/admin/individualDonorReport',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send(true);
  })




router.get('/getStateWiseDistList', async (req, res) => {
    let result = await actsAdminBal.getStateWiseDistList(req.query.stateId);
    res.send(result);
});
router.get('/getDateWiseDangerZoneData', async (req, res) => {
    let result = await actsAdminBal.getDateWiseDangerZoneData(req.query.fromDate, req.query.toDate);
    res.send(result);
});
router.post('/addNewDangerZone', async (req, res) => {
    let result = await actsAdminBal.addNewDangerZone(req.body);
    res.send(result);
});
router.post('/removeOneDangerZone', async (req, res) => {
    let result = await actsAdminBal.removeOneDangerZone(req.body);
    res.send(result);
});
router.post('/updateOneDangerZone', async (req, res) => {
    let result = await actsAdminBal.updateOneDangerZone(req.body);
    res.send(result);
})
router.get('/getDateWiseWarningZoneData', async (req, res) => {
    let result = await actsAdminBal.getDateWiseWarningZoneData(req.query.fromDate, req.query.toDate);
    res.send(result);
});
router.post('/addNewWarningZone', async (req, res) => {
    let result = await actsAdminBal.addNewWarningZone(req.body);
    res.send(result);
});
router.post('/removeOneWarningZone', async (req, res) => {
    let result = await actsAdminBal.removeOneWarningZone(req.body);
    res.send(result);
});
router.post('/updateOneWarningZone', async (req, res) => {
    let result = await actsAdminBal.updateOneWarningZone(req.body);
    res.send(result);
});
router.post('/addIndexCase', async (req, res) => {
    let result = await actsAdminBal.addIndexCase(req.body);
    res.send(result);
});
router.get('/getIndexCaseList', async (req, res) => {
    let result  = await actsAdminBal.getIndexCaseList();
    res.send(result);
});
router.post('/updateIndexCase', async (req, res) => {
    let result = await actsAdminBal.updateIndexCase(req.body.caseNo, req.body.data);
    res.send(result);
});
router.get('/getLocationHistory', async (req, res) => {
    let result = await actsAdminBal.getLocationHistory(req.query.caseNo);
    res.send(result);
});
router.get('/getPrimaryContactVisitedPlaces', async (req, res) => {
    let result = await actsAdminBal.getPrimaryContactVisitedPlaces(req.query.caseNo);
    res.send(result);
});


// NEW UPDATETS

router.post('/changeMyUpdates', async (req, res) => {
    let result = await actsAdminBal.changeMyUpdates(req.body.condition, req.body.newValue, req.body.collectionName);
    res.send(result);
});
router.post('/removeMyDocument', async (req, res) => {
    let result = await actsAdminBal.removeMyDocument(req.body.condition, req.body.collectionName);
    res.send(result);
});
router.post('/insertMyDocuments', async (req, res) => {
    let result = await actsAdminBal.insertMyDocuments(req.body.data, req.body.collectionName);
    res.send(result);
});

//Add Blood Group
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
                let response1 =[];
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


