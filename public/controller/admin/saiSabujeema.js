var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {

    $scope.sabujeema_id = sabujeema_id;
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;
    $scope.noAtIndividualHousehold = 0;
    $scope.noAtCommunityPlaces = 0;
    $scope.noAtSsvip = 0;
    $scope.noTulshiPlant = 0;
    $scope.noNeemPlant = 0;
    $scope.noSajanPlant = 0;
    $scope.noOthersPlant = 0;
    $scope.noPreviousYearPlant = 0;
    $scope.noAtSsvip = 0;
    // $http.get('http://localhost:7900/bloodDonation/getConvenordatadistdistinct')
    // .then(response => {
    //     $scope.districtList = response.data;
    // });
    $scope.loadDistricts = function () {
        $http.get("http://localhost:7900/bloodDonation/adminRoute/getresoursesdistwisedata")
            .then(function (response) {
                $scope.districtList = response.data;
            });
    }
    $scope.loadSamithiList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/adminRoute/getresoursesDistWiseSamithiList?dist_id=' + $scope.dist)
            $scope.samithiList = response.data;
            $scope.$apply();
        } catch (e) { }
    }
    $scope.samithiListWithoutDistrictId = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/adminRoute/getresoursesDistWiseSamithiList1?district_id=' + district_id)
            $scope.samithiList = response.data;
            $scope.$apply();
        } catch (e) { }
    }


    $scope.bhajanMandaliList = async () => {
        try {
            let response = await $http.get('http://localhost:7900/bloodDonation/adminRoute/bhajanMandaliListwiseData?samithi_id=' + $scope.samiti)
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


    $scope.Submit = async () => {
        let idp = document.querySelector('#idp').files[0];
        if (idp != undefined) {
            $scope.data1 = [];
            $scope.data = {};

            $scope.data.user_id = user_id;
            $scope.data.dist_id = district_id;

            $scope.data.dist = $scope.dist;

            $scope.data.samiti = $scope.samiti;
            $scope.data.bhajanMandali = $scope.bhajanMandali;
            $scope.data.noAtIndividualHousehold = $scope.noAtIndividualHousehold;
            $scope.data.noAtCommunityPlaces = $scope.noAtCommunityPlaces;
            $scope.data.noAtSsvip = $scope.noAtSsvip;
            $scope.data.noTulshiPlant = $scope.noTulshiPlant;
            $scope.data.noNeemPlant = $scope.noNeemPlant;
            $scope.data.noSajanPlant = $scope.noSajanPlant;
            $scope.data.noOthersPlant = $scope.noOthersPlant;
            $scope.data.noPreviousYearPlant = $scope.noPreviousYearPlant;
            $scope.data.remarks = $scope.remarks;
            $scope.data.monthEnded = $scope.monthEnded;


            var data = new FormData();
            var request = new XMLHttpRequest();
            data.append('idp', document.querySelector('#idp').files[0]);
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    window.alert("Your Request Submitted Sucessfully");

                    window.location.href = "http://localhost:7900/bloodDonation/admin/saiSabujeema";
                }
            };
            data.append('Name1', JSON.stringify(JSON.parse(angular.toJson($scope.data))));
            request.open('POST', "http://localhost:7900/bloodDonation/adminRoute/addSaiSabuJeemaData");
            request.send(data);




        } else {
            window.alert('Upload Mandatory Files');
        }
    }


    $scope.edit = function () {
        if ($scope.sabujeema_id != '') {
            $http.get("http://localhost:7900/bloodDonation/adminRoute/getSaiSabujeemaApplicationDetails?sabujeema_id=" + $scope.sabujeema_id)
                .then(function (response) {

                    $scope.details = response.data[0];
                    $scope.bhajanMandali = $scope.details.bhajanmandali_id;
                    $scope.noAtIndividualHousehold = $scope.details.noatindividualhousehold;
                    $scope.noAtCommunityPlaces = $scope.details.noatcommunityplaces;
                    $scope.noAtSsvip = $scope.details.noatssvip;
                    $scope.noTulshiPlant = $scope.details.notulshiplant;
                    $scope.noNeemPlant = $scope.details.noneemplant;
                    $scope.noSajanPlant = $scope.details.nosajanplant;
                    $scope.noOthersPlant = $scope.details.noothersplant;
                    $scope.noPreviousYearPlant = $scope.details.nopreviousyearplant;
                    $scope.idp = $scope.details.photo;
                    $scope.remarks = $scope.details.remarks;
                    $scope.monthEnded = new Date($scope.details.monthended);

                    $scope.showIdpError = true;
                    $scope.idpFileGood = "UPLOADED";


                    $http.get("http://localhost:7900/bloodDonation/adminRoute/getresoursesdistwisedata")
                        .then(function (response) {
                            $scope.districtList = response.data;
                            $scope.dist = $scope.details.dist_id;

                            $http.get('http://localhost:7900/bloodDonation/adminRoute/getresoursesDistWiseSamithiList?dist_id=' + $scope.dist)
                                .then(function (response) {
                                    $scope.samithiList = response.data;
                                    $scope.samiti = $scope.details.samiti_id;
                                    $http.get('http://localhost:7900/bloodDonation/adminRoute/bhajanMandaliListwiseData?samithi_id=' + $scope.samiti)
                                        .then(function (response) {
                                            if (response.data.length == 0) {
                                                $scope.bhajanMandaliListshow = [];
                                                objectData = $scope.samithiList[$scope.samithiList.findIndex(x => x.samithi_id == $scope.samiti)];
                                                $scope.bhajanMandaliListshow.push({ bhajanmandali_name: this.objectData.name, bhajanmandali_id: this.objectData.samithi_id })

                                            } else {
                                                $scope.bhajanMandaliListshow = response.data;
                                                $scope.bhajanMandali = $scope.details.bhajanmandali_id;
                                            }
                                        });
                                });

                        });



                });
        } else {

            $scope.loadDistricts();

        }
    }
    $scope.edit();
    $scope.update = async () => {
        $scope.data1 = [];
        $scope.data = {};


        $scope.data.user_id = user_id;
        $scope.data.dist_id = district_id;

        $scope.data.dist = $scope.dist;

        $scope.data.samiti = $scope.samiti;
        $scope.data.bhajanMandali = $scope.bhajanMandali;
        $scope.data.noAtIndividualHousehold = $scope.noAtIndividualHousehold;
        $scope.data.noAtCommunityPlaces = $scope.noAtCommunityPlaces;
        $scope.data.noAtSsvip = $scope.noAtSsvip;
        $scope.data.noTulshiPlant = $scope.noTulshiPlant;
        $scope.data.noNeemPlant = $scope.noNeemPlant;
        $scope.data.noSajanPlant = $scope.noSajanPlant;
        $scope.data.noOthersPlant = $scope.noOthersPlant;
        $scope.data.noPreviousYearPlant = $scope.noPreviousYearPlant;
        // $scope.data.idp = $scope.idp;
        $scope.data.remarks = $scope.remarks;
        $scope.data.monthEnded = $scope.monthEnded;
        $scope.data.sabujeema_id = $scope.sabujeema_id;


        let idp = document.querySelector('#idp').files[0];
        var data = new FormData();
        var request = new XMLHttpRequest();
        data.append('idp', document.querySelector('#idp').files[0]);
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                window.alert("Your Data is Updated");

                window.location.href = "http://localhost:7900/bloodDonation/admin/saiSabujeema";
            }
        };
        data.append('Name1', JSON.stringify(JSON.parse(angular.toJson($scope.data))));
        request.open('POST', "http://localhost:7900/bloodDonation/adminRoute/updateSaiSabuJeemaData");
        request.send(data);

    }
    $scope.userPhotoCheck = function () {
        let idp = document.querySelector('#idp').files[0];
        if (idp != undefined) {
            var theSize = idp.size;
            var checkType = idp.type;
            if (checkType == "image/jpeg" || checkType == "image/png" || checkType == "image/jpg") { // validation of file extension using regular expression before file upload
                $scope.idpFileGood = "";
                $scope.showIdpError = true;
                if (theSize > 1000000)  // validation according to file size(in bytes)
                {
                    alert('file size too large');
                    document.getElementById("idp").value = null;
                    $scope.showIdpError = true;
                    $scope.idpFileGood = "File size too large";
                }

            }
            else {
                $scope.idpFileGood = "Wrong file Type Selected";
                $scope.showIdpError = true;
                document.getElementById("idp").value = null;

            }

        }
        else {
            window.alert('Upload Mandatory Files');
        }
        $scope.$apply();
    }


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
