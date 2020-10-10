var app = angular.module("myApp", [])
app.controller("myCtrl", async ($scope, $http) => {
    var district_id = document.querySelector('meta[name="district_id"]').getAttribute('content');
    $scope.district_id = district_id;
    var user_id = document.querySelector('meta[name="user_id"]').getAttribute('content');
    $scope.user_id = user_id;

    var un = getCookie('un');
    
    $http.get('http://localhost:7900/bloodDonation/adminRoute/getUserDetails/' + un)
        .then(responsed => {
            $scope.userList = responsed.data;
        })
    $scope.updateData = (cmp) => {
        var url = "http://localhost:7900/passwordUpdate.html?id=" + cmp.id;
        location.replace(url);
    }
});
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
    if (getCookie('un') == null) {
        location.replace("login.html");
    }
    else {
        eraseCookie('un');
        location.replace("login.html");
    }

}
function unchk() {
    if (getCookie('un') == null) {
        location.replace("login.html");
    }
}

