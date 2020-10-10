var express = require('express');
var router = express.Router();
var permission = require('../models/permission');

var actsAdminBal = require('../models/BAL/AdminBal');
module.exports = router;





router.get('/convernorData', permission.permission("USER"), function (req, res, next) {
    res.render('views/user/CovidSevaReport', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role });
});
router.get('/convenorDetails', permission.permission("USER"), function (req, res, next) {
    res.render('views/user/covidSeva', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role });
});
router.get('/changePassword', permission.permission("USER"), (req, res) => {
    res.render('views/user/changePassword', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role })
});
router.get('/migrantSurvey', permission.permission("USER"), (req, res) => {
    res.render('views/user/migrantSurvey', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, migrate_id: req.query.migrate_id })
});
router.get('/migrantAllData', permission.permission("USER"), (req, res) => {
    res.render('views/user/migrantAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, migrate_id: req.query.migrate_id })
});
router.get('/migrantSurveyViewPage', permission.permission("USER"), (req, res) => {
    res.render('views/user/migrantSurveyViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, migrate_id: req.query.migrate_id })
});
router.get('/resourcePersons', permission.permission("USER"), (req, res) => {
    res.render('views/user/resourcePersons', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, id: req.query.id })
});
router.get('/resourcePersonsAllData', permission.permission("USER"), (req, res) => {
    res.render('views/user/resourcePersonsAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, id: req.query.id })
});
router.get('/resourcePersonsViewPage', permission.permission("USER"), (req, res) => {
    res.render('views/user/resourcePersonsViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, id: req.query.id })
});
router.get('/saiSabujeema', permission.permission("USER"), (req, res) => {
    res.render('views/user/saiSabujeema', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, sabujeema_id: req.query.sabujeema_id })
});
router.get('/saiSabujeemaAllData', permission.permission("USER"), (req, res) => {
    res.render('views/user/saiSabujeemaAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, sabujeema_id: req.query.sabujeema_id })
});
router.get('/saiSabujeemaViewPage', permission.permission("USER"), (req, res) => {
    res.render('views/user/saiSabujeemaViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role, sabujeema_id: req.query.sabujeema_id })
});
router.get('/beneficiariesReport', permission.permission("USER"), (req, res) => {
    res.render('views/user/beneficiariesReport', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , beneficiariesreportid: req.query.beneficiariesreportid })
});
router.get('/beneficiariesReportAllData', permission.permission("USER"), (req, res) => {
    res.render('views/user/beneficiariesReportAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , beneficiariesreportid: req.query.beneficiariesreportid })
});
router.get('/beneficiariesReportViewPage', permission.permission("USER"), (req, res) => {
    res.render('views/user/beneficiariesReportViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , beneficiariesreportid: req.query.beneficiariesreportid })
});
router.get('/activitiesReport', permission.permission("USER"), (req, res) => {
    res.render('views/user/activitiesReport', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , activitiesreportid : req.query.activitiesreportid  })
});
router.get('/activitiesReportAllData', permission.permission("USER"), (req, res) => {
    res.render('views/user/activitiesReportAllData', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , activitiesreportid : req.query.activitiesreportid  })
});
router.get('/activitiesReportViewPage', permission.permission("USER"), (req, res) => {
    res.render('views/user/activitiesReportViewPage', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , activitiesreportid : req.query.activitiesreportid  })
});
router.get('/officeBearersInformation', permission.permission("USER"), (req, res) => {
    res.render('views/user/officeBearersInformation', { district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role , officebearersinformationid : req.query.officebearersinformationid })
});
router.get('/addDonation', permission.permission("USER"), (req, res) => {
    res.render('views/user/addDonation',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/detailsDonor', permission.permission("USER"), (req, res) => {
   
    res.render('views/user/detailsDonor',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/donorReport', permission.permission("USER"), (req, res) => {
    res.render('views/user/donorReport',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/detailsCamp', permission.permission("USER"), (req, res) => {
    res.render('views/user/detailsCamp',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,campid : req.query.campid  })
});
router.get('/campUpdate', permission.permission("USER"), (req, res) => {
    res.render('views/user/campUpdate',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,campid : req.query.campid  })
});
router.get('/donorFilter', permission.permission("USER"), (req, res) => {
    res.render('views/user/donorFilter',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/detailsDonation', permission.permission("USER"), (req, res) => {
    res.render('views/user/detailsDonation',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
});
router.get('/individualDonorReport', permission.permission("USER"), (req, res) => {
    res.render('views/user/individualDonorReport',{ district_id: req.session.district_id, user_id: req.session.user_id, userRole: req.session.role,donerid : req.query.donerid  })
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
