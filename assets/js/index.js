var lastloaded = 0
var lastfollowloaded = 0
var feedState = "global"

$("global-btn").onclick = function () {
    feedSelect("global")
}

$("followed-btn").onclick = function () {
    feedSelect("followed")
}

function feedSelect(state) {
    if (state == "followed") {
        feedState = "followed"
        $("global-btn").classList.remove("primary")
        $("followed-btn").classList.add("primary")
        $("global-posts").style.display = "none"
        $("global-load-more").style.display = "none"
        $("followed-posts").style.display = ""
        $("followed-load-more").style.display = ""
    } else {
        feedState = "global"
        $("followed-btn").classList.remove("primary")
        $("global-btn").classList.add("primary")
        $("followed-posts").style.display = "none"
        $("followed-load-more").style.display = "none"
        $("global-posts").style.display = ""
        $("global-load-more").style.display = ""
    }
}


function loadMoreBlock(id) {
    var loadMore = document.createElement("button")
    loadMore.setAttribute("class", "button full")
    loadMore.setAttribute("id", id)
    loadMore.setAttribute("onclick", `loadMore("${id}")`)
    loadMore.appendChild(document.createTextNode("Load More"))
    return loadMore
}

function loadMore(id) {
    if (id == "followed-load-more") {
        fetch(`${rootAPI}/v3/getfollowposts.sjs?sess=${sess}&id=${lastfollowloaded}`).then(response => response.json()).then((json) => {
            var keys = Object.keys(json);
            var posts = ""
            for (var i = keys.length - 1; i >= 0; i--) {
                posts += toBlock(keys[i], json[keys[i]])
                lastfollowloaded = keys[i]
            }
            lastfollowloaded = keys[0]
            $("followed-posts").innerHTML += posts
        }).catch((err) => { console.log(err) })
    } else if ("global-load-more") {
        fetch(`${rootAPI}/v2/getposts.sjs?id=${lastloaded}`).then(response => response.json()).then((json) => {
            var keys = Object.keys(json);
            var posts = "";
            for (var i = lastloaded - 1; i > lastloaded - 21; i--) {
                posts += toBlock(i, json[i])
            }
            lastloaded = lastloaded - 20;
            $("global-posts").innerHTML += posts
        }).catch((err) => { console.log(err) })
    }

}

function loadPosts() {
    fetch(`${rootAPI}/v2/getposts.sjs`).then(response => response.json()).then((json) => {
        $("global-posts").innerHTML = ""
        delete json.totalposts;
        var keys = Object.keys(json);
        lastloaded = keys[0];
        var posts = "";
        for (var i = 19; i >= 0; i--) {
            posts += toBlock(keys[i], json[keys[i]]);
        }
        $("global-posts").innerHTML = posts
        $("loadMoreContainer").appendChild(loadMoreBlock("global-load-more"))
        feedSelect(feedState)
    }).catch((err) => { console.log(err) })

    if (loggedIn) {
        fetch(`${rootAPI}/v3/getfollowposts.sjs?sess=${sess}`).then(response => response.json()).then((json) => {
            $("followed-posts").innerHTML = ""
            var keys = Object.keys(json)
            var posts = ""
            for (var i = keys.length - 1; i >= 0; i--) {
                posts += toBlock(keys[i], json[keys[i]])
                lastfollowloaded = keys[i]
            }
            lastfollowloaded = keys[0]
            $("followed-posts").innerHTML = posts
            $("loadMoreContainer").appendChild(loadMoreBlock("followed-load-more"))
            feedSelect(feedState)
        }).catch((err) => { console.log(err) })
    }
}

loadPosts()