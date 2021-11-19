fetch(rootAPI + "/v2/getposts.sjs").then(response => response.json()).then((json) => {
    $("recent-posts").innerHTML = ""
    var keys = Object.keys(json)
    lastloaded = keys[0]
    var posts = ""
    for (var i = 19; i >= 0; i--) {
        posts += toBlock(keys[i], json[keys[i]])
    }
    var loadMore = document.createElement("button")
    loadMore.setAttribute("class", "button full")
    loadMore.appendChild(document.createTextNode("Load More"))
    $("recent-posts").innerHTML = posts
    $("recent-posts").appendChild(loadMore)
}).catch((err) => { console.log(err) })