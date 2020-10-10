// JavaScript source code


var app = angular.module("myApp", [])
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
});
app.controller("ChangePassCtrl", async ($scope, $http) => {
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    $scope.changePassword = async () => {
        if ($scope.newPassword === $scope.reEnterPassword) {
            try {
                let oldPass = SHA256($scope.oldPassword);
                await $http.post('http://localhost:7900/bloodDonation/changePassword/', { user_id: $scope.user_id, oldPass: oldPass, newPass: $scope.newPassword })
                window.alert('Your password chaned succesfully.');
                window.location.replace('http://localhost:7900/bloodDonation/admin/convenorDetails');
            } catch (e) {
                $scope.oldPassword = '';
                $scope.newPassword = '';
                $scope.reEnterPassword = '';
                window.alert(e.data);
                console.error(e.data);
            }
        } else {
            $scope.oldPassword = '';
            $scope.newPassword = '';
            $scope.reEnterPassword = '';
            window.alert('Wrong password. please re-enter password.')
        }
    }
});
app.controller("myCtrl", async ($scope, $http, Excel, $timeout) => {

    $scope.showAllList = false;
    $scope.totalNfp = 0;
    $scope.totalNfk = 0;
    $scope.totalOtherItems = 0;
    $scope.totalNosdi = 0;
    $scope.totalAppCost = 0;

    var un = getCookie('un');
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    // $scope.changePassword = async () => {
    //     if($scope.newPassword === $scope.reEnterPassword) {
    //         try{
    //             await $http.post('http://localhost:7900/bloodDonation/changePassword/', { user_id:  $scope.user_id, oldPass: $scope.oldPassword, newPass: $scope.newPassword})
    //             window.alert('Your password chaned succesfully.');
    //             window.location.replace('http://localhost:7900/bloodDonation/admin/convenorDetails');
    //         } catch(e) {
    //             window.alert(e.data);
    //             console.error(e.data);
    //         }
    //     } else{
    //         $scope.oldPassword = '';
    //         $scope.newPassword = '';
    //         $scope.reEnterPassword = '';
    //         window.alert('Wrong password. please re-enter password.')
    //     }
    // } 
    $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
        .then(response => {
            $scope.districtList = response.data;
        });
    $scope.getFilteredData = async () => {
        $scope.totalNfp = 0;
        $scope.totalNfk = 0;
        $scope.totalOtherItems = 0;
        $scope.totalNosdi = 0;
        $scope.totalAppCost = 0;
        $http.post('http://localhost:7900/bloodDonation/getFilteredConvenorData', { dist_id: $scope.dist, fromDate: $scope.fromDate, toDate: $scope.toDate })
            .then(response => {
                $scope.indexConvenorList = response.data;
                $scope.showAllList = true;
                $scope.indexConvenorList.forEach(e => {
                    $scope.totalNfp = $scope.totalNfp + parseInt(e.nfp);
                    $scope.totalNfk = $scope.totalNfk + parseInt(e.nfk);
                    $scope.totalOtherItems = $scope.totalOtherItems + parseInt(e.other_items);
                    $scope.totalNosdi = $scope.totalNosdi + parseInt(e.nosdi);
                    $scope.totalAppCost = $scope.totalAppCost + parseInt(e.app_cost);
                })
            })
    }
    $scope.viewPic = (url) => {
        $scope.viewPicUrl = '../.' + url;
    }
    $scope.editField = (cmp) => {
        var url = "http://localhost:7900/ConvenorDetails.html?id=" + cmp.convId;
        location.replace(url);
    }
    $scope.deleteField = (cmp) => {
        removeCamp(cmp.convId);
        $http.get('http://localhost:7900/bloodDonation/getConvenorDetails/' + un)
            .then(response => {
                $scope.indexConvenorList = response.data;
            })
    }
    $scope.selectRemoveItem = (x) => {
        $scope.removeItem = x;
    }
    $scope.removeSevaData = async () => {
        let response = await $http.post('http://localhost:7900/bloodDonation/removeSevaData/' + $scope.removeItem.conv_id)
        if (response.data) {
            $scope.getFilteredData();
            window.alert('Convenor removed successfully.');
        } else {
            window.alert('Sorry enable to remove that convenor. Please try again.');
        }
    }
    $scope.exportToExcel = function (tableIdSeed) {
        var exportHref = Excel.tableToExcel(tableIdSeed, 'adoReportSeed');
        $timeout(function () { location.href = exportHref; }, 100); // trigger download
    }

});
app.controller("UpdateCtrl", async ($scope, $http) => {
    var imglink;
    $scope.nfp = 0;
    $scope.nak = 0;
    $scope.othitems = 0;
    $scope.nsi = 0;
    $scope.aci = 0;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
        .then(response => {
            $scope.districtList = response.data;
            var qs = (function (a) {
                if (a == "") return {};
                var b = {};
                for (var i = 0; i < a.length; ++i) {
                    var p = a[i].split('=', 2);
                    if (p.length == 1)
                        b[p[0]] = "";
                    else
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
                return b;
            })(window.location.search.substr(1).split('&'));
            $http.get('http://localhost:7900/bloodDonation/getConvenordatadist')
                .then(response2 => {
                    $scope.ConvenorList = response2.data;
                })

            if (qs["id"] != null) {
                $http.get('http://localhost:7900/bloodDonation/getConvenorDetailsId/' + qs["id"])
                    .then(response1 => {
                        var resCm = response1.data;
                        $http.get('http://localhost:7900/bloodDonation/getConvenordatadist/' + resCm[0].District)
                            .then(response4 => {


                                $scope.ConvenorList = response4.data;
                                // $scope.dist = $scope.dist;
                            })


                        $scope.StateRecognitionNumber = resCm[0].StateRecognitionNumber;
                        // $scope.dist = resCm[0].District;
                        $scope.NameConvener = resCm[0].NameConvener;
                        $scope.SevaSamithi = resCm[0].SevaSamithi;
                        $scope.Address = resCm[0].Address;

                        $scope.nfp = parseInt(resCm[0].nfp);
                        $scope.nak = parseInt(resCm[0].nak);
                        $scope.othitems = resCm[0].othitems;
                        $scope.bdos = resCm[0].bdos;
                        $scope.nsi = parseInt(resCm[0].nsi);
                        $scope.aci = parseFloat(resCm[0].aci);

                        $scope.convId = resCm[0].convId;
                        var imglink = resCm[0].campFiles;
                        var mydiv = document.getElementById("linkDWN");

                        var j = 0;
                        for (let imgd of imglink) {
                            var aTag = document.createElement('a');
                            aTag.setAttribute('id', j + 1);
                            aTag.setAttribute('style', 'padding-right:10px');
                            aTag.setAttribute('href', "http://localhost:7900/bloodDonation/downloadFile/" + JSON.parse(imglink[j]).campFile);
                            aTag.innerHTML = "<i class='fas fa-download' aria-hidden='true'></i>";
                            mydiv.appendChild(aTag);
                            j = parseInt(j) + 1;
                        }



                        $("#add").css('display', 'none'); $("#update").css('display', 'true');
                        if (getCookie('un') != 'ADMIN') {

                            //  angular.element(document.getElementById('dist'))[0].disabled = true;
                        }
                    })
            }
            else {
                if (getCookie('un') != 'ADMIN') {
                    // $scope.dist = getCookie('un');
                    // angular.element(document.getElementById('dist'))[0].disabled = true;
                }
                $("#add").css('display', 'true'); $("#update").css('display', 'none');
            }
        })

    $scope.loadSamithiList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/getDistWiseSamithiList/' + $scope.dist)
            $scope.samithiList = response.data;
            $scope.$apply();
        } catch (e) { }
    }

    $scope.updateData = async () => {
        var valFlag = 1;
        if (parseInt(valFlag) == 1) {
            var theFile = document.querySelector('#idp').files[0];
            if (theFile != undefined) {
                var checkType = theFile.type;
                if (checkType !== "image/jpeg" && checkType !== "image/png") {
                    // validation of file extension using regular expression before file upload
                    $scope.idpFileGood = "Please select jpg/jpeg/png image";
                    $scope.showIdpError = true;
                }
                else {
                    var fd = new FormData();
                    var i = 0;
                    var campFiles = [];
                    for (let img of document.querySelector('#idp').files) {
                        var d = new Date();
                        fd.append('files', document.querySelector('#idp').files[parseInt(i)]);
                        campFiles.push(JSON.stringify({ "campFile": img.name.replace(img.name.split('.').pop(), "").replace('.', "") + '-' + d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "." + img.name.split('.').pop() }));
                        i = parseInt(i) + 1;
                    }

                    let data = {
                        'condition': { 'convId': parseInt($scope.convId) },
                        'newValue': {
                            'District': $scope.dist,
                            'SevaSamithi': $scope.SevaSamithi,
                            'StateRecognitionNumber': $scope.StateRecognitionNumber,
                            'NameConvener': $scope.NameConvener,

                            'Address': $scope.Address,

                            'nfp': $scope.nfp,
                            'nak': $scope.nak,
                            'othitems': $scope.othitems,
                            'bdos': $scope.bdos,
                            'nsi': $scope.nsi,
                            'aci': $scope.aci,
                            'campFiles': campFiles
                        },
                        'collectionName': 'ConvenorDetails'
                    };

                    fd.append('data', JSON.stringify(data));
                    try {

                        await $http.post('http://localhost:7900/bloodDonation/changeMyUpdatesDB1', fd, {
                            transformRequest: angular.identity,
                            headers: { 'Content-Type': undefined },
                            body: { data }
                        });
                        window.alert(`Convener ${$scope.convId} is updated successfully.`);


                        //window.location.href = 'covideSeva.html'
                    } catch (e) {
                        window.alert('Problem to add Try Again.')
                    }
                }
            }
            else {
                var fd = new FormData();
                let data = {
                    'condition': { 'convId': parseInt($scope.convId) },
                    'newValue': {
                        'District': $scope.dist,
                        'SevaSamithi': $scope.SevaSamithi,
                        'StateRecognitionNumber': $scope.StateRecognitionNumber,
                        'NameConvener': $scope.NameConvener,

                        'Address': $scope.Address,

                        'nfp': $scope.nfp,
                        'nak': $scope.nak,
                        'othitems': $scope.othitems,
                        'bdos': $scope.bdos,
                        'nsi': $scope.nsi,
                        'aci': $scope.aci
                    },
                    'collectionName': 'ConvenorDetails'
                };

                fd.append('data', JSON.stringify(data));
                try {

                    await $http.post('http://localhost:7900/bloodDonation/changeMyUpdatesDB1', fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined },
                        body: { data }
                    });
                    window.alert(`Service ${$scope.cmpid} is updated successfully.`);


                    window.location.href = 'ConvenorData.html'
                } catch (e) {
                    window.alert('Problem to add Try Again.')
                }
            }
        }
        else {
            window.alert('Problem to add Try Again.');
        }
    }
    $scope.addData = async () => {
        //var valFlag = CheckValdCamp($scope);
        var valFlag = 1;
        if (parseInt(valFlag) == 1) {
            var theFile = document.querySelector('#idp').files[0];
            if (theFile != undefined) {
                var checkType = theFile.type;
                if (checkType !== "image/jpeg" && checkType !== "image/png") {
                    // validation of file extension using regular expression before file upload
                    $scope.idpFileGood = "Please select jpg/jpeg/png image";
                    $scope.showIdpError = true;
                }
                else {
                    var theSize = theFile.size;
                    if (theSize > 1000000)
                    // validation according to file size(in bytes)
                    {
                        $scope.idpFileGood = "File Size is Too Long";
                        $scope.showIdpError = true;
                    }
                    else {
                        $scope.loader = true;
                        var fd = new FormData();
                        var i = 0;
                        var campFiles = [];
                        for (let img of document.querySelector('#idp').files) {
                            fd.append('files', document.querySelector('#idp').files[parseInt(i)]);
                            campFiles.push(JSON.stringify({ "campFile": img.name }));
                            i = parseInt(i) + 1;
                        }

                        var data = {
                            Date: $scope.date,
                            dist_id: $scope.dist,
                            SevaSamithi: $scope.SevaSamithi,
                            Address: $scope.Address,
                            nfp: $scope.nfp,
                            nak: $scope.nak,
                            othitems: $scope.othitems,
                            bdos: $scope.bdos,
                            nsi: $scope.nsi,
                            aci: $scope.aci,
                            campFiles: campFiles,
                            userId: $scope.user_id
                        };
                        fd.append('data', JSON.stringify(data));

                        //data.append('files', document.querySelector('#idp').files[0]);
                        try {
                            await $http.post('http://localhost:7900/bloodDonation/addConvenor', fd, {
                                transformRequest: angular.identity,
                                headers: { 'Content-Type': undefined }
                            });
                            window.alert(`Service is added successfully.`);
                            window.location.href = 'http://localhost:7900/bloodDonation/admin/convenorDetails'
                        } catch (e) {
                            window.alert('Problem to add Try Again.')
                        }

                    }
                }
            }
            else {
                // $scope.idpFileGood = "Please Choose a PDF file";
                // $scope.showIdpError = true;
                let fd = new FormData();

                let data = {
                    Date: $scope.date,
                    dist_id: $scope.dist,
                    SevaSamithi: $scope.SevaSamithi,
                    Address: $scope.Address,
                    nfp: $scope.nfp,
                    nak: $scope.nak,
                    othitems: $scope.othitems,
                    bdos: $scope.bdos,
                    nsi: $scope.nsi,
                    aci: $scope.aci,
                    userId: $scope.user_id
                };
                fd.append('data', JSON.stringify(data));

                //data.append('files', document.querySelector('#idp').files[0]);
                try {
                    await $http.post('http://localhost:7900/bloodDonation/addConvenor', fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    });
                    window.alert(`Service is added successfully.`);
                    window.location.href = 'http://localhost:7900/bloodDonation/admin/convenorDetails'
                } catch (e) {
                    window.alert('Problem to add Try Again.')
                }
            }
        }
        $scope.$apply();
    }

    $scope.bindDetailsData = async () => {

        $http.get('http://localhost:7900/bloodDonation/getConvenordatadist/' + $scope.dist)
            .then(response2 => {


                $scope.ConvenorList = response2.data;
                $scope.dist = $scope.dist;
            })
    }

    $scope.bindDetailsDataSamiti = async () => {

        $http.get('http://localhost:7900/bloodDonation/getConvenordataSamiti/' + $scope.SevaSamithi)
            .then(response2 => {


                $scope.NameConvener = response2.data[0].NameoftheConvener;
                $scope.Address = response2.data[0].Address;
            })
    }

});

app.controller("migrateCtrl", async ($scope, $http) => {
    $scope.part1 = true;
    $scope.part2 = false;
    $scope.part3 = false;
    $scope.part4 = false;
    $scope.migrate_id = migrate_id;
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    $scope.loadStates = function () {
        $http.get("http://localhost:7900/bloodDonation/state")
            .then(function (response) {
                $scope.states = response.data;
            });
    }

    $scope.previous1 = () => {
        $scope.part1 = true;
        $scope.part2 = false;
        $scope.part3 = false;
        $scope.part4 = false;
    }
    $scope.previous2 = () => {
        $scope.part1 = false;
        $scope.part2 = true;
        $scope.part3 = false;
        $scope.part4 = false;
        $scope.part5 = false;
    }
    $scope.previous3 = () => {
        $scope.part1 = false;
        $scope.part2 = false;
        $scope.part3 = true;
        $scope.part4 = false;
        $scope.part5 = true;
    }

    $scope.next1 = () => {
        $scope.part1 = false;
        $scope.part2 = true;
        $scope.part3 = false;
        $scope.part4 = false;
    }
    $scope.next2 = () => {
        $scope.part1 = false;
        $scope.part2 = false;
        $scope.part3 = true;
        $scope.part4 = false;
    }
    $scope.next3 = () => {
        $scope.part1 = false;
        $scope.part2 = false;
        $scope.part3 = false;
        $scope.part4 = true;

    }
    $scope.addRow = function () {
        if ($scope.SectorEmployed != undefined && $scope.skill != undefined && $scope.workExperience != undefined && $scope.avgIncome != undefined && $scope.intrestSkill != undefined && $scope.description != undefined && $scope.remarks != undefined) {
            var movie = {};
            movie.sectoremployed = $scope.SectorEmployed;
            movie.skill = $scope.skill;
            movie.workexperience = $scope.workExperience;
            movie.avgincome = $scope.avgIncome;
            movie.intrestskill = $scope.intrestSkill;
            movie.description = $scope.description;
            movie.remarks = $scope.remarks;
            $scope.movieArray.push(movie);

            // CLEAR TEXTBOX.
            $scope.SectorEmployed = ''
            $scope.skill = '';
            $scope.workExperience = '';
            $scope.avgIncome = '';
            $scope.intrestSkill = '';
            $scope.description = '';
            $scope.remarks = '';
            $scope.part5 = true;

        }
        else {
            window.alert('Upload Mandatory Fields');
        }

    };

    $scope.Submit = async () => {
        $scope.data1 = [];
        $scope.data = {};
        // 43
        $scope.data.user_id = user_id;

        $scope.data.dist_id = district_id;
        $scope.data.migrantName = $scope.migrantName;
        $scope.data.dob = $scope.dob;
        $scope.data.gender = $scope.gender;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.category = $scope.category;
        $scope.data.material = $scope.material;
        $scope.data.fatherName = $scope.fatherName;
        $scope.data.fMember = $scope.fMember;
        $scope.data.block = $scope.block;
        $scope.data.gp = $scope.gp;
        $scope.data.village = $scope.village;


        $scope.data.farmerId = $scope.farmerId;
        $scope.data.acNumber = $scope.acNumber;
        $scope.data.aadharNumber = $scope.aadharNumber;
        $scope.data.voterId = $scope.voterId;
        $scope.data.landArea = $scope.landArea;
        $scope.data.salary = $scope.salary;
        $scope.data.monthlyIncome = $scope.monthlyIncome;
        $scope.data.qualification = $scope.qualification;
        $scope.data.skillDevelopmentCertification = $scope.skillDevelopmentCertification;
        $scope.data.animals = $scope.animals;
        $scope.data.noOfCows = $scope.noOfCows;
        $scope.data.noOfGoat = $scope.noOfGoat;
        $scope.data.noOfSheep = $scope.noOfSheep;
        $scope.data.noOfOtherAnimal = $scope.noOfOtherAnimal;

        $scope.data.returningState = $scope.returningState;
        $scope.data.planAfterLockDown = $scope.planAfterLockDown;
        $scope.data.stayBackAfterLockDown = $scope.stayBackAfterLockDown;
        $scope.data.expectedSalary = $scope.expectedSalary;
        $scope.data.underMGNREGA = $scope.underMGNREGA;




        $scope.data.remarksByTheSurveyer = $scope.remarksByTheSurveyer;

        // var arrMovie = [];
        // angular.forEach($scope.movieArray, function (value) {
        //     arrMovie.push('SectorEmployed:' + value.SectorEmployed + ', skill:' + value.skill +
        //         ', workExperience:' + value.workExperience + ', avgIncome:' + value.avgIncome +
        //         ', intrestSkill:' + value.intrestSkill + ', skill:' + value.description +
        //         ', remarks:' + value.remarks);
        // });

        $scope.data.display = $scope.movieArray;

        try {
            await $http.post('http://localhost:7900/bloodDonation/addMigrateData', $scope.data);
            window.alert(`Your Request Submitted Sucessfully`);
            window.location.href = "http://localhost:7900/bloodDonation/user/migrantSurvey";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }



    }
    $scope.edit = function () {
        if ($scope.migrate_id != '') {
            $http.get("http://localhost:7900/bloodDonation/getApplicationDetails?migrate_id=" + $scope.migrate_id)
                .then(function (response) {
                    $scope.details = response.data[0];

                    $scope.migrantName = $scope.details.migrant_name;
                    $scope.dob = new Date($scope.details.dob);
                    $scope.gender = $scope.details.gender;
                    $scope.mobNo = $scope.details.mobno;
                    $scope.category = $scope.details.category;
                    $scope.material = $scope.details.material;
                    $scope.fatherName = $scope.details.fathername;
                    $scope.fMember = $scope.details.fmember;
                    $scope.block = $scope.details.block;
                    $scope.gp = $scope.details.gp;
                    $scope.village = $scope.details.village;


                    $scope.farmerId = $scope.details.farmerid;
                    $scope.acNumber = $scope.details.acnumber;
                    $scope.aadharNumber = $scope.details.aadharnumber;
                    $scope.voterId = $scope.details.voterid;
                    $scope.landArea = $scope.details.landarea;
                    $scope.salary = $scope.details.salary;
                    $scope.monthlyIncome = $scope.details.monthlyincome;
                    $scope.qualification = $scope.details.qualification;
                    $scope.skillDevelopmentCertification = $scope.details.skilldevelopmentcertification;
                    $scope.animals = $scope.details.animals;
                    $scope.noOfCows = $scope.details.noofcows;
                    $scope.noOfGoat = $scope.details.noofgoat;
                    $scope.noOfSheep = $scope.details.noofsheep;
                    $scope.noOfOtherAnimal = $scope.details.noofotheranimal;

                    $scope.planAfterLockDown = $scope.details.planafterlockdown;
                    $scope.stayBackAfterLockDown = $scope.details.staybackafterlockdown;
                    $scope.expectedSalary = $scope.details.expectedsalary;
                    $scope.underMGNREGA = $scope.details.undermgnrega;

                    $scope.movieArray = response.data;//$scope.details.allskillData;
                    $scope.remarksByTheSurveyer = $scope.details.remarksbythesurveyer;



                    $http.get("http://localhost:7900/bloodDonation/state")
                        .then(function (response) {
                            $scope.states = response.data;
                            $scope.returningState = $scope.states[$scope.states.findIndex(x => x.statecode == $scope.details.returningstate)];

                        });


                });
        } else {

            $scope.loadStates();

        }
    }
    $scope.edit();
    $scope.update = async () => {
        $scope.data1 = [];
        $scope.data = {};
        $scope.data.migrantName = $scope.migrantName;
        $scope.data.dob = $scope.dob;
        $scope.data.gender = $scope.gender;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.category = $scope.category;
        $scope.data.material = $scope.material;
        $scope.data.fatherName = $scope.fatherName;
        $scope.data.fMember = $scope.fMember;
        $scope.data.block = $scope.block;
        $scope.data.gp = $scope.gp;
        $scope.data.village = $scope.village;

        $scope.data.farmerId = $scope.farmerId;
        $scope.data.acNumber = $scope.acNumber;
        $scope.data.aadharNumber = $scope.aadharNumber;
        $scope.data.voterId = $scope.voterId;
        $scope.data.landArea = $scope.landArea;
        $scope.data.salary = $scope.salary;
        $scope.data.monthlyIncome = $scope.monthlyIncome;
        $scope.data.qualification = $scope.qualification;
        $scope.data.skillDevelopmentCertification = $scope.skillDevelopmentCertification;
        $scope.data.animals = $scope.animals;
        $scope.data.noOfCows = $scope.noOfCows;
        $scope.data.noOfGoat = $scope.noOfGoat;
        $scope.data.noOfSheep = $scope.noOfSheep;
        $scope.data.noOfOtherAnimal = $scope.noOfOtherAnimal;

        $scope.data.returningState = $scope.returningState;
        $scope.data.planAfterLockDown = $scope.planAfterLockDown;
        $scope.data.stayBackAfterLockDown = $scope.stayBackAfterLockDown;
        $scope.data.expectedSalary = $scope.expectedSalary;
        $scope.data.underMGNREGA = $scope.underMGNREGA;



        // $scope.data.SectorEmployed = $scope.SectorEmployed;
        // $scope.data.otherSector = $scope.otherSector;
        // $scope.data.skill = $scope.skill;
        // $scope.data.workExperience = $scope.workExperience;
        // $scope.data.avgIncome = $scope.avgIncome;
        // $scope.data.intrestSkill = $scope.intrestSkill;
        // $scope.data.otherSkill = $scope.otherSkill;
        // $scope.data.description = $scope.description;
        // $scope.data.remarks = $scope.remarks;
        $scope.data.display = $scope.movieArray;
        $scope.data.remarksByTheSurveyer = $scope.remarksByTheSurveyer;

        try {
            await $http.post('http://localhost:7900/bloodDonation/updateMigrateData', { updateData: $scope.data, migrate_id: $scope.migrate_id });
            window.alert(`Your Data is Updated`);
            window.location.href = "http://localhost:7900/bloodDonation/user/migrantSurvey";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }


    }
    $scope.movieArray =
        [
        ];
    $scope.removeRow = function (index) {
        $scope.movieArray.splice(index, 1);
    };


});
app.controller("migrantAllData", async ($scope, $http, Excel, $timeout) => {

    var un = getCookie('un');
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    $scope.loadStates = function () {
        $http.get("http://localhost:7900/bloodDonation/state")
            .then(function (response) {
                $scope.states = response.data;
            });
    }
    $scope.loadStates();




    $scope.deleted = function (y) {
        $scope.allDetails = y;
    }

    $scope.allDataShow = function () {
        try {
            $http.get('http://localhost:7900/bloodDonation/allSkillDataShow?user_id=' + user_id)
                .then(function (response) {
                    $scope.alldata = response.data;
                });

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }
    $scope.allDataShow();
    $scope.view = function (y) {
        $scope.migrate_id = y;
        window.location.href = "http://localhost:7900/bloodDonation/user/migrantSurveyViewPage?migrate_id=" + $scope.migrate_id;
    }
    $scope.edit = function (y) {
        $scope.migrate_id = y;
        window.location.href = "http://localhost:7900/bloodDonation/user/migrantSurvey?migrate_id=" + $scope.migrate_id;

    }


    $scope.oneDataDeleted = async (migrate_id) => {
        try {
            await $http.post('http://localhost:7900/bloodDonation/oneDataDeleted', { migrate_id: migrate_id });
            $scope.allDataShow();

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }

});
app.controller("migrantSurveyViewPage", async ($scope, $http, Excel, $timeout) => {

    var un = getCookie('un');
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    $scope.migrate_id = migrate_id;



    $scope.allDataShow = function (y) {
        try {
            $http.get('http://localhost:7900/bloodDonation/allMigrantDatashow?migrate_id=' + migrate_id)
                .then(function (response) {
                    $scope.alldata = response.data;
                });

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }
    $scope.allskillDataview = function () {
        try {
            $http.get('http://localhost:7900/bloodDonation/allskillDataview?migrate_id=' + migrate_id)
                .then(function (response) {
                    $scope.allskillData = response.data;
                });

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }
    $scope.allskillDataview();
    $scope.allDataShow();
    $scope.back = (y) => {

        window.location.href = "http://localhost:7900/bloodDonation/user/migrantAllData";

    }






});
app.controller("resourcePersons", async ($scope, $http) => {

    $scope.id = id;
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    // $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
    // .then(response => {
    //     $scope.districtList = response.data;
    // });
    $scope.loadDistricts = function () {
        $http.get("http://localhost:7900/bloodDonation/getresoursesdistwisedata")
            .then(function (response) {
                $scope.districtList = response.data;
            });
    }
    $scope.loadSamithiList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/getresoursesDistWiseSamithiList?dist_id=' + $scope.dist)
            $scope.samithiList = response.data;
            $scope.$apply();
        } catch (e) { }
    }
    $scope.samithiListWithoutDistrictId = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/getresoursesDistWiseSamithiList1?district_id=' + district_id)
            $scope.getresoursesDistWiseSamithiList = response.data;
            $scope.$apply();
        } catch (e) { }
    }


    $scope.Submit = async () => {
        $scope.data1 = [];
        $scope.data = {};

        $scope.data.user_id = user_id;
        $scope.data.dist_id = district_id;
        if (user_id != 'ADMIN') {
            $scope.data.dist = $scope.district_id;
        }
        else {
            $scope.data.dist = $scope.dist;
        }

        $scope.data.resourceType = $scope.resourceType;
        $scope.data.name = $scope.name;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.samiti = $scope.samiti;
        $scope.data.profession = $scope.profession;
        $scope.data.areaofExpertise = $scope.areaofExpertise;
        $scope.data.workshop = $scope.workshop;
        $scope.data.remarks = $scope.remarks;


        try {
            await $http.post('http://localhost:7900/bloodDonation/addResouresPersonData', $scope.data);
            window.alert(`Your Request Submitted Sucessfully`);
            window.location.href = "http://localhost:7900/bloodDonation/user/resourcePersons";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }



    }
    $scope.edit = function () {
        if ($scope.id != '') {
            $http.get("http://localhost:7900/bloodDonation/getResoursesApplicationDetails?id=" + $scope.id)
                .then(function (response) {
                    $scope.details = response.data[0];

                    $scope.name = $scope.details.name;
                    $scope.resourceType = $scope.details.resourcetype;
                    $scope.mobNo = $scope.details.mobno;
                    $scope.profession = $scope.details.profession;
                    $scope.areaofExpertise = $scope.details.areaofexpertise;
                    $scope.workshop = $scope.details.workshop;
                    $scope.remarks = $scope.details.remarks;
                    

                    // $http.get("http://localhost:7900/bloodDonation/getresoursesdistwisedata")
                    //     .then(function (response) {
                    //         $scope.districtList = response.data;
                    //         $scope.dist = $scope.details.dist;
                    //     });
                    if (user_id == 'ADMIN') {
                    $http.get("http://localhost:7900/bloodDonation/getresoursesdistwisedata")
                        .then(function (response) {
                            $scope.districtList = response.data;
                            $scope.dist = $scope.details.dist;

                            $http.get('http://localhost:7900/bloodDonation/getresoursesDistWiseSamithiList?dist_id=' + $scope.dist)
                                .then(function (response) {
                                    $scope.samithiList = response.data;
                                    $scope.samiti = $scope.details.samiti;

                                });

                        });
                    }
                    else{
                        $scope.dist = $scope.details.dist_name;
                        $http.get('http://localhost:7900/bloodDonation/getresoursesDistWiseSamithiList?dist_id=' + $scope.details.district_id)
                                .then(function (response) {
                                    $scope.getresoursesDistWiseSamithiList = response.data;
                                    $scope.samiti = $scope.details.samiti;

                                });
                    }

                });
        } else {


            if (user_id != 'ADMIN') {
                $scope.dist = user_id;
                $scope.samithiListWithoutDistrictId();
            }
            $scope.loadDistricts();

        }
    }
    $scope.edit();
    $scope.update = async () => {
        $scope.data1 = [];
        $scope.data = {};

        $scope.data.user_id = user_id;
        $scope.data.dist_id = district_id;
        if (user_id != 'ADMIN') {
            $scope.data.dist = $scope.district_id;
        }
        else {
            $scope.data.dist = $scope.dist;
        }
        // $scope.data.dist = $scope.district_id;
        $scope.data.resourceType = $scope.resourceType;
        $scope.data.name = $scope.name;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.samiti = $scope.samiti;
        $scope.data.profession = $scope.profession;
        $scope.data.areaofExpertise = $scope.areaofExpertise;
        $scope.data.workshop = $scope.workshop;
        $scope.data.remarks = $scope.remarks;


        try {
            await $http.post('http://localhost:7900/bloodDonation/updateResoursesData', { updateData: $scope.data, id: $scope.id });
            window.alert(`Your Data is Updated`);
            window.location.href = "http://localhost:7900/bloodDonation/user/resourcePersonsAllData";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }


    }



});
app.controller("resoursesPersonAllData", async ($scope, $http, Excel, $timeout) => {

    var un = getCookie('un');
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    $scope.deleted = function (y) {
        $scope.allDetails = y;
    }

    $scope.allDataShow = function () {
        try {
            $http.get('http://localhost:7900/bloodDonation/allResourseDataShow?district_id=' + district_id+ "&user_id=" + $scope.user_id)
                .then(function (response) {
                    $scope.alldata = response.data;""
                });

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }
    $scope.allDataShow();
    $scope.view = function (y) {
        $scope.id = y;
        window.location.href = "http://localhost:7900/bloodDonation/user/resourcePersonsViewPage?id=" + $scope.id;
    }
    $scope.edit = function (y) {
        $scope.id = y;
        window.location.href = "http://localhost:7900/bloodDonation/user/resourcePersons?id=" + $scope.id;

    }


    $scope.oneDataDeleted = async (id) => {
        try {
            await $http.post('http://localhost:7900/bloodDonation/oneResourceDataDeleted', { id: id });
            $scope.allDataShow();

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }

});
app.controller("resourcePersonsViewPage", async ($scope, $http, Excel, $timeout) => {

    var un = getCookie('un');
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    $scope.allDataShow = function (y) {
        try {
            $http.get('http://localhost:7900/bloodDonation/resourcePersonsDatashow?id=' + id)
                .then(function (response) {
                    $scope.alldata = response.data;
                });

        } catch (e) {
            window.alert('Problem to add Try Again.')
        }

    }
    $scope.allDataShow();
    $scope.back = (y) => {

        window.location.href = "http://localhost:7900/bloodDonation/user/resourcePersonsAllData";

    }





});
app.filter('dateRangeFrom', function () {
    return function (alldata, fromDateFilter) {
        var filtered = [];
        if (fromDateFilter != undefined) {
            angular.forEach(alldata, y => {
                if (Date.parse(y.dataapplied) >= Date.parse(fromDateFilter)) {
                    filtered.push(y);
                }
            });
            return filtered;
        } else {
            return alldata;
        }
    };
});
app.filter('dateRangeTo', function () {
    return function (alldata, toDateFilter) {
        var filtered = [];
        if (toDateFilter != undefined) {
            angular.forEach(alldata, function (y) {
                if (Date.parse(y.dataapplied) <= Date.parse(toDateFilter)) {
                    filtered.push(y);
                }
            });
            return filtered;
        } else {
            return alldata;
        }
    };
});
function removeCamp(convId) {
    let data = {
        "condition": {
            "convId": convId
        },
        "collectionName": "ConvenorDetails"
    };
    var url = "http://localhost:7900/bloodDonation/removeMyDocumentDB";
    postData(data, url);
}
function postData(data, url) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var response = xmlhttp.responseText;
                return response;

            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(data));
}



function validate() {
    var name = document.getElementById('name');
    var phone = document.forms["bloodCamp"]["contactNo"];
    var phone1 = document.getElementById('contactRef');
    var dob = document.getElementById('dob').value;
    var inpdt = new Date(dob);
    var today = new Date();
    var Difference_In_Time = today.getTime() - inpdt.getTime();
    var age = new Date(Difference_In_Time);
    var age_dt = Math.abs(age.getUTCFullYear() - 1970);

    if (name.value == "") {
        window.alert("Please enter your name.");
        name.focus();
        return false;
    }
    else if (isNaN(name.value) /*"%d[10]"*/) {
        alert("name confirmed");
    }
    else {
        window.alert("please enter character in name");
        name.focus();
        name.value = "";
        return false;
    }
    if (phone.value == "") {
        window.alert("Please enter your telephone number.");
        phone.focus();
        return false;
    }
    else if (phone.value.match(/^\d{10}$/)) {
        alert("number confirmed");
    }
    else {
        window.alert("please enter valid numbers only");
        return false;
    }
    if (phone1.value == "") {
        window.alert("Please enter your telephone number.");
        phone.focus();
        return false;
    }
    else if (phone1.value.match(/^\d{10}$/)) {
        alert("number confirmed");
    }
    else {
        window.alert("please enter valid numbers only");
        return false;
    }
    if (age_dt >= 18) {
        alert("confirmed");
    }
    else {
        window.alert("you are not eligible for donate blood");
        return false;
    }

    return true;
}

function binddist() {
    var url = "http://localhost:7900/bloodDonation/getConvenordatadistdistinct";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var array = xmlhttp.responseText;

                var option = '<option value="0">-- select --</option>';
                for (index = 0; index < JSON.parse(array).length; index++) {
                    option += '<option value="' + JSON.parse(array)[index].districtName + '">' + JSON.parse(array)[index].districtName + '</option>';
                }

                $('#district').append(option);
                $('#cDistrict').append(option);
                if (getCookie('un') != "ADMIN") {
                    document.getElementById("district").value = getCookie('un');
                    $('#district').attr("disabled", true);
                    document.getElementById("cDistrict").value = getCookie('un');

                    $('#cDistrict').attr("disabled", true);

                }


            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("GET", url, true);

    xmlhttp.send();
}

function bindDonationHistoryGrid() {
    unchk();

    var qs = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    if (qs["id"] != null) {
        //qs["id"]
        alert(qs["id"]);
        var url = "http://localhost:7900/bloodDonation/getDonationById/" + qs["id"];

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {

                    var array = xmlhttp.responseText;


                    var data = JSON.parse(xmlhttp.responseText);
                    for (var i = 0, len = data.length; i < len; i++) {
                        tr = $('<tr/>');
                        tr.append("<td>" + data[i].donorId + "</td>");
                        //tr.append("<td>" + data[i].donationDate + "</td>");
                        tr.append("<td>" + data[i].currentPlace + "</td>");
                        tr.append("<td>" + data[i].currentDistrict + "</td>");
                        $('tbody').append(tr);
                    }

                } else if (xmlhttp.status == 400) {
                    alert('there was an error 400');
                } else {
                    alert('something else other than 200 was returned');
                }
            }
        };
        xmlhttp.open("GET", url, true);

        xmlhttp.send();
    }
}

function viewFilterData() {

    let data1 = {
        "bloodGroup": document.getElementById('bloodGroup').value
    };
    var url = "http://localhost:7900/bloodDonation/getDonorFilterList";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var data = JSON.parse(xmlhttp.responseText);

                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i] != null) {
                        tr = $('<tr/>');
                        tr.append("<td>" + data[i].donorId + "</td>");
                        tr.append("<td>" + data[i].name + "</td>");
                        tr.append("<td>" + data[i].gender + "</td>");
                        tr.append("<td>" + data[i].dateOfBirth + "</td>");
                        tr.append("<td>" + data[i].bloodGroup + "</td>");
                        tr.append("<td>" + data[i].lastDonationDate + "</td>");
                        tr.append("<td>" + data[i].district + "</td>");
                        tr.append("<td>" + data[i].Address + "</td>");
                        tr.append("<td>" + data[i].orgCode + "</td>");
                        $('tbody').append(tr);
                    }

                }
                inittable(arrayReturn);

            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(data1));
}




function userValidate(userId, myPassword) {
    let data = {
        "userdetails": {
            "username": userId,
            "password": myPassword
        }
    };
    var url = "http://localhost:7900/bloodDonation/validateUserLogin";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {

                var response = xmlhttp.responseText;
                if (response != null) {


                    var datares = JSON.parse(response);
                    if (datares.length > 0) {
                        if (datares[0].validated != null) {
                            if (datares[0].validated == "1") {
                                setCookie('un', userId, 1);
                                location.replace("ConvenorData.html");
                            }
                            else {
                                window.alert('Please enter correct username password');
                            }
                        }
                        else {
                            window.alert('Please enter correct username password');
                        }
                    }
                    else {
                        window.alert('Please enter correct username password');
                    }

                }
                else {
                    window.alert('Please enter correct username password');
                }

            } else if (xmlhttp.status == 400) {
                alert('there was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send(JSON.stringify(data));




}

//cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function logout() {
    var url = "http://localhost:7900/bloodDonation/admin/logout";


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                location.replace("/");
            } else if (xmlhttp.status == 400) {
                window.alert('there was an error 400');
            } else {
                window.alert('something else other than 200 was returned');
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xmlhttp.send();

}
function unchk() {
    if (getCookie('un') == null) {
        location.replace("login.html");
    }
}

function CheckValdCamp($scope) {
    var rtnflag = 1;
    if ($scope.OrgCode == '' || $scope.OrgCode == null || $scope.OrgCode.textContent == '' || $scope.OrgCode.text == '' || $scope.OrgCode.length < 4) {
        rtnflag = 0;
        $scope.showOrgCode = "Please input valud Organisation Code";
        $scope.showOrgCodeError = true;
    }

    return rtnflag;
}





