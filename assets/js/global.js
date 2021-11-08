const rootAPI = "https://api.stibarc.com/";

function $(id) {
    if (id.startsWith(".")) {
        return document.getElementsByClassName(id.substring(1));
    } else {
        return document.getElementById(id);
    }
}

function getAllUrlParams() {
    var queries = location.search.slice(1).split("&");
    var obj = {};
    for (var i in queries) {
        if (queries[i] != "") {
            var tmp = queries[i].split("=");
            obj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
        }
    }
    return obj;
}

document.addEventListener("click", function (event) {
    /* user dropdown */
    var pfpBtnClicked = $("pfpBtn").contains(event.target);
    var dropDownClicked = $("pfpDropdown").contains(event.target);
    if (
        $("pfpDropdown").style.display == "none" ||
        $("pfpDropdown").style.display == "" ||
        dropDownClicked
    ) {
        $("pfpDropdown").style.display = "block";
    } else {
        $("pfpDropdown").style.display = "none";
    }
    if (!pfpBtnClicked && !dropDownClicked) {
        //the click was outside the nav dropdown
        $("pfpDropdown").style.display = "none";
    }
    /* dialog */
    var overlays = $(".overlay");
    for (var i = 0; i < overlays.length; i++) {
        if (overlays[i] == event.target) {
            overlays[i].style.display = "none";
        }
    }
});

function closeDialogs() {
    const overlays = $(".overlay");
    for (var i = 0; i < overlays.length; i++) {
        overlays[i].style.display = "none";
    }
}

var sess = localStorage.getItem("sess");
var loggedIn = false;
if (sess !== null && sess !== "") {
    loggedIn = true;
    getUserInfo();
}

const loggedOutDivs = $(".loggedOut");
const loggedInDivs = $(".loggedIn");
if(loggedIn) {
    for (var i = 0; i < loggedInDivs.length; i++) {
        loggedInDivs[i].style.display = "";
    }
    for (var i = 0; i < loggedOutDivs.length; i++) {
        loggedOutDivs[i].style.display = "none";
    }
} else {
    for (var i = 0; i < loggedInDivs.length; i++) {
        loggedInDivs[i].style.display = "none";
    }
    for (var i = 0; i < loggedOutDivs.length; i++) {
        loggedOutDivs[i].style.display = "";
    }
}

// get profile info //
function getUserInfo() {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var username = this.responseText.replace(/(\r\n|\n|\r)/gm, "");
        localStorage.setItem("username", username);
        getUserPfp('pfpBtnImg', username);
        $("pfpUsername").textContent = username;
    };
    xhttp.open('GET', rootAPI + '/v2/getusername.sjs?sess=' + localStorage.getItem("sess"), true);
    xhttp.send();
}

// get profile pfp //
function getUserPfp(callback, username) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var userPfp = this.responseText;
        if (callback == 'post') {
            $("postPfp").src = userPfp;
        } else {
            localStorage.setItem('pfp', userPfp);
            $("pfpBtnImg").src = userPfp;
        }
    };
    xhttp.open('GET', rootAPI + '/v2/getuserpfp.sjs?id=' + username, true);
    xhttp.send();
}