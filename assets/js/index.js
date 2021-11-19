var lastloaded = 0;
var lastfollowloaded = 0;

function loadMoreBlock() {
    var loadMore = document.createElement("button")
    loadMore.setAttribute("class", "button full")
    loadMore.setAttribute("onclick", "loadMore()")
    loadMore.appendChild(document.createTextNode("Load More"))
    return loadMore
}

function loadMore() {
    fetch("https://api.stibarc.com/v2/getposts.sjs?id=" + lastloaded).then(response => response.json()).then((json) => {
        var posts = "";
        for (var i = lastloaded - 1; i > lastloaded - 21; i--) {
            posts += toBlock(i, json[i])
        }
        $("recent-posts").innerHTML += posts
        lastloaded = lastloaded - 20;
    }).catch((err) => { console.log(err) })
}

fetch(rootAPI + "/v2/getposts.sjs").then(response => response.json()).then((json) => {
    $("recent-posts").innerHTML = ""
    var keys = Object.keys(json)
    lastloaded = keys[0]
    var posts = ""
    for (var i = 19; i >= 0; i--) {
        posts += toBlock(keys[i], json[keys[i]])
    }
    $("recent-posts").innerHTML = posts
    $("loadMoreContainer").appendChild(loadMoreBlock());
}).catch((err) => { console.log(err) })