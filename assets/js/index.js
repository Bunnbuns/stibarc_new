fetch(rootAPI + "/v2/getposts.sjs").then(response => response.json()).then((json) => {
    $("recent-posts").innerHTML = ""
    var keys = Object.keys(json)
    lastloaded = keys[0]
    var posts = ""
    for (var i = 19; i >= 0; i--) {
        posts += toBlock(keys[i], json[keys[i]])
    }
    $("recent-posts").innerHTML = posts
}).catch((err) => { console.log(err) })