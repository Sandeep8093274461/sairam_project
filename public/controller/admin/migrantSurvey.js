var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {
    $scope.showAck = false;
    $scope.showAppForm = true;
    $scope.part1 = true;
    $scope.part2 = false;
    $scope.part3 = false;
    $scope.part4 = false;


    $scope.migrate_id = migrate_id;
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;

    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    $scope.loadDistricts = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/getresoursesdistwisedata")
            .then(function (response) {
                $scope.districtList = response.data;
            });
    }
    $scope.loadStates = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/state")
            .then(function (response) {
                $scope.states = response.data;
            });
    }
    $scope.loadblockList = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/loadblock?district_id=" + $scope.district)
            .then(function (response) {
                $scope.blockList = response.data;
            });
    }
    $scope.loadblock = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/loadblock?district_id=" + $scope.district_id)
            .then(function (response) {
                $scope.blockList = response.data;
            });
    }
    $scope.loadgp = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/loadgp?block_code=" + $scope.block)
            .then(function (response) {
                $scope.gpList = response.data;
            });
    }
    $scope.loadVillages = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/loadVillages?gp_code=" + $scope.gp)
            .then(function (response) {
                $scope.villageList = response.data;
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

    }
    $scope.previous3 = () => {
        $scope.part1 = false;

        if ($scope.migrant == 'Yes') {
            $scope.part2 = false;
            $scope.part3 = true;
            $scope.part4 = false;
        } else {
            $scope.part4 = false;
            $scope.part3 = false;
            $scope.part2 = true;
        }
    }


    $scope.previous4 = () => {
        $scope.showAck = false;
        $scope.showAppForm = true;
    }
    $scope.previous5 = () => {
        window.location.href = "http://localhost:7900/bloodDonation/admin/migrantAllData";
    }
    $scope.next4 = () => {
        $scope.showAck = true;
        $scope.showAppForm = false;
        $scope.districtName = $scope.districtList[$scope.districtList.findIndex(x => x.district_id == $scope.district)];
        $scope.blockName = $scope.blockList[$scope.blockList.findIndex(x => x.block_code == $scope.block)];
        $scope.panchayatname = $scope.gpList[$scope.gpList.findIndex(x => x.panchayat_code == $scope.gp)];
        $scope.villageName = $scope.villageList[$scope.villageList.findIndex(x => x.villagecode == $scope.village)];
        $scope.returningStateName = $scope.states[$scope.states.findIndex(x => x.statecode == $scope.returningState)];
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
        if ($scope.migrant == 'Yes') {
            $scope.part3 = true;
            $scope.part4 = false;
        } else {
            $scope.part3 = false;
            $scope.part4 = true;
        }
    }
    $scope.next3 = () => {
        $scope.part1 = false;
        $scope.part2 = false;
        $scope.part3 = false;
        $scope.part4 = true;

    }

    $scope.addRow = function () {
        if ($scope.SectorEmployed != undefined && $scope.skill != undefined && $scope.workExperience != undefined && $scope.avgIncome != undefined && $scope.intrestSkill != undefined) {
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
        $scope.data.district = $scope.district;
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
        $scope.data.migrant = $scope.migrant;
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
            await $http.post('http://localhost:7900/bloodDonation/adminRoute/addMigrateData', $scope.data);
            window.alert(`Your Request Submitted Sucessfully`);
            window.location.href = "http://localhost:7900/bloodDonation/admin/migrantSurvey";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }



    }
    $scope.edit = function () {
        if ($scope.migrate_id != '') {
            $http.get("http://localhost:7900/bloodDonation/adminRoute/getApplicationDetails?migrate_id=" + $scope.migrate_id)
                .then(function (response) {
                    $scope.details = response.data.details;

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
                    $scope.village = $scope.details.villagename;


                    $scope.farmerId = $scope.details.farmerid;
                    $scope.acNumber = $scope.details.acnumber;
                    $scope.aadharNumber = $scope.details.aadharnumber;
                    $scope.voterId = $scope.details.voterid;
                    $scope.landArea = $scope.details.landarea;
                    $scope.salary = $scope.details.salary;
                    $scope.monthlyIncome = $scope.details.monthlyincome;
                    $scope.qualification = $scope.details.qualification;
                    $scope.skillDevelopmentCertification = $scope.details.skilldevelopmentcertification;
                    $scope.migrant = $scope.details.migrant;
                    $scope.animals = $scope.details.animals;
                    $scope.noOfCows = $scope.details.noofcows;
                    $scope.noOfGoat = $scope.details.noofgoat;
                    $scope.noOfSheep = $scope.details.noofsheep;
                    $scope.noOfOtherAnimal = $scope.details.noofotheranimal;

                    $scope.planAfterLockDown = $scope.details.planafterlockdown;
                    $scope.stayBackAfterLockDown = $scope.details.staybackafterlockdown;
                    $scope.expectedSalary = $scope.details.expectedsalary;
                    $scope.underMGNREGA = $scope.details.undermgnrega;

                    $scope.movieArray = response.data.movieArray;//$scope.details.allskillData;
                    $scope.remarksByTheSurveyer = $scope.details.remarksbythesurveyer;

                    $http.get("http://localhost:7900/bloodDonation/adminRoute/getresoursesdistwisedata")
                        .then(function (response) {
                            $scope.districtList = response.data;
                            $scope.district = $scope.details.district;
                            $http.get("http://localhost:7900/bloodDonation/adminRoute/loadblock?district_id=" + $scope.details.district)
                                .then(function (response) {
                                    $scope.blockList = response.data;
                                    $scope.block = $scope.details.block;

                                    $http.get("http://localhost:7900/bloodDonation/adminRoute/loadgp?block_code=" + $scope.block)
                                        .then(function (response) {
                                            $scope.gpList = response.data;
                                            $scope.gp = $scope.details.gp;
                                            $http.get("http://localhost:7900/bloodDonation/adminRoute/loadVillages?gp_code=" + $scope.gp)
                                                .then(function (response) {
                                                    $scope.villageList = response.data;
                                                    $scope.village = $scope.details.village;
                                                });
                                        });

                                });
                        });


                    $http.get("http://localhost:7900/bloodDonation/adminRoute/state")
                        .then(function (response) {
                            $scope.states = response.data;
                            // $scope.returningState = $scope.states[$scope.states.findIndex(x => x.statecode == $scope.details.returningstate)];
                            $scope.returningState = $scope.details.returningstate

                        });


                });
        } else {

            $scope.loadDistricts();
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
        $scope.data.district = $scope.district;
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
        $scope.data.migrant = $scope.migrant;
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
        $scope.data.display = $scope.movieArray;
        $scope.data.remarksByTheSurveyer = $scope.remarksByTheSurveyer;

        try {
            await $http.post('http://localhost:7900/bloodDonation/adminRoute/updateMigrateData', { updateData: $scope.data, migrate_id: $scope.migrate_id, district_id: district_id });
            window.alert(`Your Data is Updated`);
            window.location.href = "http://localhost:7900/bloodDonation/admin/migrantAllData";
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
function removeCamp(convId) {
    let data = {
        "condition": {
            "convId": convId
        },
        "collectionName": "ConvenorDetails"
    };
    var url = "http://localhost:7900/bloodDonation/adminRoute/removeMyDocumentDB";
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
    var url = "http://localhost:7900/bloodDonation/adminRoute/getConvenordatadistdistinct";

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
        var url = "http://localhost:7900/bloodDonation/adminRoute/getDonationById/" + qs["id"];

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
    var url = "http://localhost:7900/bloodDonation/adminRoute/getDonorFilterList";
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
    var url = "http://localhost:7900/bloodDonation/adminRoute/validateUserLogin";
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


