const rootAPI = "https://api.stibarc.com"
const rootCDN = "https://cdn.stibarc.com"

var images = ["png", "jpg", "gif", "webp", "svg"]
var videos = ["mov", "mp4", "webm"]
var audios = ["spx", "m3a", "m4a", "wma", "wav", "mp3"]
var htmlers = ["herronjo", "DomHupp", "Aldeenyo", "savaka", "alluthus", "Bunnbuns", "Merkle", "flolon"]

function $(id) {
    if (id.startsWith(".")) {
        return document.getElementsByClassName(id.substring(1))
    } else {
        return document.getElementById(id)
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function getAllUrlParams() {
    var queries = location.search.slice(1).split("&")
    var obj = {}
    for (var i in queries) {
        if (queries[i] != "") {
            var tmp = queries[i].split("=")
            obj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1])
        }
    }
    return obj
}

function sanetize(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function truncate(str, len) {
    var returnValue = str
    if (str.length > len) {
        returnValue = str.slice(0, len) + "..."
    }
    return returnValue
}

function serialize(obj) {
    var str = []
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
        }
    return str.join("&")
}

function verifiedUser() {
    return `<span class="material-icons-round icon verified" title="Verified User">verified</span>`
}

function toBlock(id, post) {
    return (`<div class="post" onclick="goToPost(${id});">
		<a class="post-title" href="post.html?id=${id}"><b>${emojify(sanetize(truncate(post.title, 100)))}</b></a>
		<div class="meta">
			<div class="flex-center">
				Posted&nbsp;by&nbsp;<a class="author" href="user.html?id=${encodeURIComponent(post.poster)}"><span class="username">${sanetize(post.poster)}</span><span>${post.verified ? verifiedUser() : ""}<span></a>
			</div>
            <div>
                &#8679; ${post.upvotes} &#8681; ${post.downvotes}
			</div>
		</div>
	</div>`)
}

function goToPost(id) {
    location.href = "post.html?id=" + id
}

var emojilist = localStorage.emojilist || "{}"
emojilist = JSON.parse(emojilist)

function refreshEmojis(callback) {
    fetch(`${rootAPI}/emojis/index.json`).then(response => response.json()).then((response) => {
        if (JSON.stringify(response) != localStorage.emojilist) {
            localStorage.emojilist = JSON.stringify(response)
            emojilist = response
        }
        if (callback) {
            callback()
        }
    }).catch((err) => { console.log(err) })
}

function emojify(text) {
    if (Object.keys(emojilist).length == 0) {
        refreshEmojis(function () {
            for (var emoji in emojilist) {
                text = text.replace(new RegExp(`:${emoji}:`, 'g'), `<img src="${rootCDN}/emojis/${emojilist[emoji].filename}" class="emoji" title=":${emoji}:" alt=":${emoji}:"></img>`)
            }
            return text
        })
    } else {
        for (var emoji in emojilist) {
            text = text.replace(new RegExp(`:${emoji}:`, 'g'), `<img src="${rootCDN}/emojis/${emojilist[emoji].filename}" class="emoji" title=":${emoji}:" alt=":${emoji}:"></img>`)
        }
        return text
    }
}

function greenify(text) {
    var conttemp = text.replace(/\r/g, "").split("\n")
    for (var i in conttemp) {
        if (conttemp[i].substring(0, 4) == "&gt;" || conttemp[i].substring(0, 1) == ">") {
            conttemp[i] = `<span style="color:green;">${conttemp[i]}</span>`
        }
    }
    return conttemp.join("<br/>")
}

document.addEventListener("click", function (event) {
    /* user dropdown */
    var pfpBtnClicked = $("pfpBtn").contains(event.target)
    var dropDownClicked = $("pfpDropdown").contains(event.target)
    if (
        $("pfpDropdown").style.display == "none" ||
        $("pfpDropdown").style.display == "" ||
        dropDownClicked
    ) {
        $("pfpDropdown").style.display = "block"
    } else {
        $("pfpDropdown").style.display = "none"
    }
    if (!pfpBtnClicked && !dropDownClicked) {
        //the click was outside the nav dropdown
        $("pfpDropdown").style.display = "none"
    }
    /* dialog */
    var overlays = $(".overlay");
    for (var i = 0; i < overlays.length; i++) {
        if (overlays[i] == event.target) {
            overlays[i].style.display = "none"
        }
    }
});

function closeDialogs() {
    const overlays = $(".overlay");
    for (var i = 0; i < overlays.length; i++) {
        overlays[i].style.display = "none"
    }
}

var sess = localStorage.getItem("sess")
var loggedIn = false
if (sess !== null && sess !== "") {
    loggedIn = true
    getUserInfo()
}

const loggedOutDivs = $(".loggedOut")
const loggedInDivs = $(".loggedIn")
if (loggedIn) {
    for (var i = 0; i < loggedInDivs.length; i++) {
        loggedInDivs[i].style.display = "inherit"
    }
    for (var i = 0; i < loggedOutDivs.length; i++) {
        loggedOutDivs[i].style.display = "none"
    }
} else {
    for (var i = 0; i < loggedInDivs.length; i++) {
        loggedInDivs[i].style.display = "none"
    }
    for (var i = 0; i < loggedOutDivs.length; i++) {
        loggedOutDivs[i].style.display = "inherit"
    }
}

if (localStorage.getItem('pfp') !== null && localStorage.getItem('pfp') !== "") {
    $("pfpBtnImg").src = localStorage.getItem('pfp')
}

function getUserInfo() {
    var xhttp = new XMLHttpRequest()
    xhttp.onload = function () {
        var username = this.responseText.replace(/(\r\n|\n|\r)/gm, "")
        localStorage.setItem("username", username)
        getUserPfp('pfpBtnImg', username)
        $("pfpUsername").textContent = username
        $("pfpUsername").title = `Signed in as ${username}`
        $("pfpUsername").href = `./user.html?id=${username}`
        $("pfpBtnImg").title = `Signed in as ${username}`
    };
    xhttp.open('GET', `${rootAPI}/v2/getusername.sjs?sess=${localStorage.getItem("sess")}`, true)
    xhttp.send();
}

function getUserPfp(callback, username) {
    var xhttp = new XMLHttpRequest()
    xhttp.onload = function () {
        var userPfp = this.responseText
        if (callback == 'post') {
            $("postPfp").src = userPfp
        } else {
            localStorage.setItem("pfp", userPfp)
            $("pfpBtnImg").src = localStorage.getItem("pfp")
        }
    };
    xhttp.open('GET', `${rootAPI}/v2/getuserpfp.sjs?id=${username}`, true)
    xhttp.send()
}

$("q").onkeyup = function (e) {
    if (e.key == "Enter") {
        var query = $("q").value
        if (query != "") {
            window.location = `./search.html?q=${encodeURIComponent(query)}`
        }
    }
}