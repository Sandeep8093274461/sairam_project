var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {

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
            $scope.getresoursesDistWiseSamithiList = response.data;
            $scope.$apply();
        } catch (e) { }
    }


    $scope.Submit = async () => {
        $scope.data1 = [];
        $scope.data = {};

        $scope.data.user_id = user_id;
        $scope.data.dist_id = district_id;

        $scope.data.dist = $scope.dist;

        $scope.data.resourceType = $scope.resourceType;
        $scope.data.name = $scope.name;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.samiti = $scope.samiti;
        $scope.data.profession = $scope.profession;
        $scope.data.areaofExpertise = $scope.areaofExpertise;
        $scope.data.workshop = $scope.workshop;
        $scope.data.remarks = $scope.remarks;


        try {
            await $http.post('http://localhost:7900/bloodDonation/adminRoute/addResouresPersonData', $scope.data);
            window.alert(`Your Request Submitted Sucessfully`);
            window.location.href = "http://localhost:7900/bloodDonation/admin/resourcePersons";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }



    }
    $scope.edit = function () {
        if ($scope.id != '') {
            $http.get("http://localhost:7900/bloodDonation/adminRoute/getResoursesApplicationDetails?id=" + $scope.id)
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

                    $http.get("http://localhost:7900/bloodDonation/adminRoute/getresoursesdistwisedata")
                        .then(function (response) {
                            $scope.districtList = response.data;
                            $scope.dist = $scope.details.dist;

                            $http.get('http://localhost:7900/bloodDonation/adminRoute/getresoursesDistWiseSamithiList?dist_id=' + $scope.dist)
                                .then(function (response) {
                                    $scope.samithiList = response.data;
                                    $scope.samiti = $scope.details.samiti;

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
        $scope.data.resourceType = $scope.resourceType;
        $scope.data.name = $scope.name;
        $scope.data.mobNo = $scope.mobNo;
        $scope.data.samiti = $scope.samiti;
        $scope.data.profession = $scope.profession;
        $scope.data.areaofExpertise = $scope.areaofExpertise;
        $scope.data.workshop = $scope.workshop;
        $scope.data.remarks = $scope.remarks;


        try {
            await $http.post('http://localhost:7900/bloodDonation/adminRoute/updateResoursesData', { updateData: $scope.data, id: $scope.id });
            window.alert(`Your Data is Updated`);
            window.location.href = "http://localhost:7900/bloodDonation/admin/resourcePersonsAllData";
        } catch (e) {
            window.alert('Problem to add Try Again.')
        }


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
