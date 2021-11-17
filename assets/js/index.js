// function toBlock(id, data) {
//     console.log(post)
//     var post = document.createElement("a")
//     post.setAttribute("class", "post")
//     post.setAttribute("href", "https://stibarc.com/post.html?id=" + id)
//     var top = document.createElement("div")
//     top.appendChild(document.createTextNode(data['title']))
//     post.appendChild(top)
//     return post
// }

// fetch("https://api.stibarc.com/v2/getposts.sjs").then(response => response.json()).then((json) => {
//     $("recent-posts").innerHTML = ""
//     var keys = Object.keys(json)
//     lastloaded = keys[0]
//     var posts = document.createElement("div")
//     posts.setAttribute("class", "posts")
//     for (var i = 19; i >= 0; i--) {
//         posts.appendChild(toBlock(keys[i], json[keys[i]]))
//     }
//     $("recent-posts").appendChild(posts)
// }).catch((err) => { })

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