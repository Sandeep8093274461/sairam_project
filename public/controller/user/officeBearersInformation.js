var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {

    $scope.officebearersinformationid = officebearersinformationid;
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    // $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
    // .then(response => {
    //     $scope.districtList = response.data;
    // });
    $scope.loadlevel = async () => {
        try {
            let response = await $http.get("http://localhost:7900/bloodDonation/userRoute/getLevel")
            $scope.levelList = response.data;
            $scope.$apply();
        } catch (e) { }

    }
    $scope.loadDistricts = async () => {
        try {
            let response = await $http.get("http://localhost:7900/bloodDonation/userRoute/getresoursesdistwisedata")
            $scope.districtList = response.data;
            $scope.$apply();
            $scope.loadSamithiList();
        } catch (e) { }

    }
    $scope.loadSamithiList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/userRoute/getresoursesDistWiseSamithiList?dist_id=' + $scope.district)
            $scope.samithiList = response.data;
            $scope.$apply();
            $scope.bhajanMandaliList();
        } catch (e) { }
    }
    $scope.bhajanMandaliList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/userRoute/bhajanMandaliListwiseData?samithi_id=' + $scope.samiti)

            if (response.data.length == 0) {
                $scope.bhajanMandaliListshow = [];
                objectData = $scope.samithiList[$scope.samithiList.findIndex(x => x.samithi_id == $scope.samiti)];
                $scope.bhajanMandaliListshow.push({ bhajanmandali_name: this.objectData.name, bhajanmandali_id: this.objectData.samithi_id })

            } else {
                $scope.bhajanMandaliListshow = response.data;
            }

            $scope.$apply();
        } catch (e) { }
    }
    $scope.loadDesignationList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/userRoute/getDesignationList?lavel_id=' + $scope.level)
            $scope.designationList = response.data;
            $scope.$apply();
        } catch (e) { }
    }
    $scope.addRow = function () {
        var movie = {};
        movie.joinprasanthiseva = $scope.joinPrasanthiSeva;
        $scope.movieArray.push(movie);
        // CLEAR TEXTBOX.
        $scope.joinPrasanthiSeva = '';


    };
    $scope.movieArray = [];
    $scope.removeRow = function (index) {
        $scope.movieArray.splice(index, 1);
    };


    $scope.Submit = async () => {
        let passportPhoto = document.querySelector('#passportPhoto').files[0];
        if (passportPhoto != undefined) {
            $scope.data1 = [];
            $scope.data = {};

            $scope.data.user_id = user_id;
            $scope.data.dist_id = district_id;
            $scope.data.level = $scope.level;
            $scope.data.designation = $scope.designation;
            $scope.data.nameOfBearers = $scope.nameOfBearers;
            $scope.data.age = $scope.age;
            $scope.data.qualification = $scope.qualification;
            $scope.data.profession = $scope.profession;
            $scope.data.mobNo = $scope.mobNo;
            $scope.data.wpNo = $scope.wpNo;
            $scope.data.email = $scope.email;
            $scope.data.saiId = $scope.saiId;
            $scope.data.yearOfJoining = $scope.yearOfJoining;
            $scope.data.howManyYearOfJoin = $scope.howManyYearOfJoin;
            $scope.data.responsibility = $scope.responsibility;
            $scope.data.alumni = $scope.alumni;
            $scope.data.joinPrasanthiSeva = $scope.movieArray;
            if ($scope.level == '01') {
                $scope.data.district = '';
                $scope.data.samiti = '';
                $scope.data.bhajanMandali = '';
            }
            else if ($scope.level == '02') {
                $scope.data.district = $scope.district;
                $scope.data.samiti = '';
                $scope.data.bhajanMandali = '';
            }
            else if ($scope.level == '03') {
                $scope.data.district = $scope.district;
                $scope.data.samiti = $scope.samiti;
                $scope.data.bhajanMandali = '';
            }
            else {
                $scope.data.district = $scope.district;
                $scope.data.samiti = $scope.samiti;
                $scope.data.bhajanMandali = $scope.bhajanMandali;
            }



            var data = new FormData();
            var request = new XMLHttpRequest();
            data.append('passportPhoto', document.querySelector('#passportPhoto').files[0]);
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    window.alert("Your Request Submitted Sucessfully");
                    // saiSabujeema
                    window.location.href = "http://localhost:7900/bloodDonation/user/officeBearersInformation";
                }
            };
            data.append('Name1', JSON.stringify(JSON.parse(angular.toJson($scope.data))));
            request.open('POST', "http://localhost:7900/bloodDonation/userRoute/addofficeBearersInformationData");
            request.send(data);




        } else {
            window.alert('Upload Mandatory Files');
        }
    }


    $scope.edit = function () {
        if ($scope.officebearersinformationid != '') {
            $http.get("http://localhost:7900/bloodDonation/userRoute/getOfficeBearersInformationDetails?officebearersinformationid=" + $scope.officebearersinformationid)
                .then(function (response) {

                    $scope.details = response.data[0];
                    $scope.level = $scope.details.level;
                    $scope.designation = $scope.details.designation;
                    $scope.nameOfBearers = $scope.details.nameofbearers;
                    $scope.age = $scope.details.age;
                    $scope.qualification = $scope.details.qualification;
                    $scope.profession = $scope.details.profession;
                    $scope.mobNo = $scope.details.mobno;
                    $scope.wpNo = $scope.details.wpno;
                    $scope.email = $scope.details.email;
                    $scope.saiId = $scope.details.saiid;
                    $scope.yearOfJoining = $scope.details.yearofjoining;
                    $scope.howManyYearOfJoin = $scope.details.howmanyyearofjoin;
                    $scope.responsibility = $scope.details.responsibility;
                    $scope.alumni = $scope.details.alumni;
                    $scope.joinPrasanthiSeva = $scope.details.joinprasanthiseva;
                    $scope.passportPhoto = $scope.details.passportphoto;

                    $scope.showPassportPhotoError = true;
                    $scope.PassportphotoFileGood = "UPLOADED";
                    $http.get("http://localhost:7900/bloodDonation/userRoute/getLevel")
                        .then(function (response) {
                            $scope.levelList = response.data;
                            $scope.level = $scope.details.level;
                            $http.get('http://localhost:7900/bloodDonation/userRoute/getDesignationList?lavel_id=' + $scope.level)
                                .then(function (response) {
                                    $scope.designationList = response.data;
                                    $scope.designation = $scope.details.designation;
                                });
                        });
                    if ($scope.details.level != '01') {
                        if ($scope.details.level == '02') {
                            $http.get("http://localhost:7900/bloodDonation/userRoute/getresoursesdistwisedata")
                                .then(function (response) {
                                    $scope.districtList = response.data;
                                    $scope.district = $scope.details.district;
                                });
                        }
                        else if ($scope.details.level == '02') {
                            $http.get("http://localhost:7900/bloodDonation/userRoute/getresoursesdistwisedata")
                                .then(function (response) {
                                    $scope.districtList = response.data;
                                    $scope.district = $scope.details.district;
                                    $http.get('http://localhost:7900/bloodDonation/userRoute/getresoursesDistWiseSamithiList?dist_id=' + $scope.district)
                                        .then(function (response) {
                                            $scope.samithiList = response.data;
                                            $scope.samiti = $scope.details.samiti;
                                        });
                                });
                        }
                        else {
                            $http.get("http://localhost:7900/bloodDonation/userRoute/getresoursesdistwisedata")
                                .then(function (response) {
                                    $scope.districtList = response.data;
                                    $scope.district = $scope.details.district;
                                    $http.get('http://localhost:7900/bloodDonation/userRoute/getresoursesDistWiseSamithiList?dist_id=' + $scope.district)
                                        .then(function (response) {
                                            $scope.samithiList = response.data;
                                            $scope.samiti = $scope.details.samiti;
                                            $http.get('http://localhost:7900/bloodDonation/userRoute/bhajanMandaliListwiseData?samithi_id=' + $scope.samiti)
                                                .then(function (response) {

                                                    if (response.data.length == 0) {
                                                        $scope.bhajanMandaliListshow = [];
                                                        objectData = $scope.samithiList[$scope.samithiList.findIndex(x => x.samithi_id == $scope.samiti)];
                                                        $scope.bhajanMandaliListshow.push({ bhajanmandali_name: this.objectData.name, bhajanmandali_id: this.objectData.samithi })

                                                    } else {
                                                        $scope.bhajanMandaliListshow = response.data;
                                                        $scope.bhajanMandali = $scope.details.bhajanmandali;
                                                    }


                                                });
                                        });

                                });

                        }

                    }






                });
        } else {
            $scope.loadlevel();

        }
    }
    $scope.edit();
    $scope.update = async () => {
        $scope.data1 = [];
        $scope.data = {};


        $scope.data.user_id = user_id;
        $scope.data.dist_id = district_id;
        $scope.data.level = $scope.level;
        $scope.data.designation = $scope.designation;
        $scope.data.nameOfBearers = $scope.nameOfBearers;
        $scope.data.age = $scope.age;
        $scope.data.qualification = $scope.qualification;
        $scope.data.profession = $scope.profession;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.wpNo = $scope.wpNo;
        $scope.data.email = $scope.email;
        $scope.data.saiId = $scope.saiId;
        $scope.data.yearOfJoining = $scope.yearOfJoining;
        $scope.data.howManyYearOfJoin = $scope.howManyYearOfJoin;
        $scope.data.responsibility = $scope.responsibility;
        $scope.data.alumni = $scope.alumni;
        $scope.data.joinPrasanthiSeva = $scope.joinPrasanthiSeva;
        $scope.data.officebearersinformationid = $scope.officebearersinformationid;
        $scope.data.passportPhoto = $scope.passportPhoto;
        if ($scope.level == '01') {
            $scope.data.district = '';
            $scope.data.samiti = '';
            $scope.data.bhajanMandali = '';
        }
        else if ($scope.level == '02') {
            $scope.data.district = $scope.district;
            $scope.data.samiti = '';
            $scope.data.bhajanMandali = '';
        }
        else if ($scope.level == '03') {
            $scope.data.district = $scope.district;
            $scope.data.samiti = $scope.samiti;
            $scope.data.bhajanMandali = '';
        }
        else {
            $scope.data.district = $scope.district;
            $scope.data.samiti = $scope.samiti;
            $scope.data.bhajanMandali = $scope.bhajanMandali;
        }

        var data = new FormData();
        var request = new XMLHttpRequest();
        data.append('passportPhoto', document.querySelector('#passportPhoto').files[0]);
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                window.alert("Your Data is Updated");

                window.location.href = "http://localhost:7900/bloodDonation/user/officeBearersInformationAllData";
            }
        };
        data.append('Name1', JSON.stringify(JSON.parse(angular.toJson($scope.data))));
        request.open('POST', "http://localhost:7900/bloodDonation/userRoute/updateOfficeBearersInformationData");
        request.send(data);

    }
    $scope.photoCheck = function () {
        let passportPhoto = document.querySelector('#passportPhoto').files[0];
        if (passportPhoto != undefined) {
            var theSize = passportPhoto.size;
            var checkType = passportPhoto.type;
            if (checkType == "image/jpeg" || checkType == "image/png" || checkType == "image/jpg") { // validation of file extension using regular expression before file upload
                $scope.PassportphotoFileGood = "";
                $scope.showPassportPhotoError = true;
                if (theSize > 1000000)  // validation according to file size(in bytes)
                {
                    alert('file size too large');
                    document.getElementById("passportPhoto").value = null;
                    $scope.showPassportPhotoError = true;
                    $scope.PassportphotoFileGood = "File size too large";
                }

            }
            else {
                $scope.PassportphotoFileGood = "Wrong file Type Selected";
                $scope.showPassportPhotoError = true;
                document.getElementById("passportPhoto").value = null;

            }

        }
        else {
            window.alert('Upload Mandatory Files');
        }
        $scope.$apply();
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
    var url = "http://localhost:7900/bloodDonation/userRoute/removeMyDocumentDB";
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
    var url = "http://localhost:7900/bloodDonation/userRoute/getConvenordatadistdistinct";

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
        var url = "http://localhost:7900/bloodDonation/userRoute/getDonationById/" + qs["id"];

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
    var url = "http://localhost:7900/bloodDonation/userRoute/getDonorFilterList";
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
    var url = "http://localhost:7900/bloodDonation/userRoute/validateUserLogin";
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
    var url = "http://localhost:7900/bloodDonation/user/logout";


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


