var id = getAllUrlParams().id;

fetch(`${rootAPI}/v2/getpost.sjs?id=${id}`).then(response => response.json()).then((json) => {
    document.title = `${json.title} - STiBaRC`
    $("title").innerHTML = emojify(sanetize(json.title))
    $("author").href = `./user.html?id=${encodeURIComponent(json.poster)}`
    $("username").innerHTML = sanetize(json.poster)
    $("verified").innerHTML = `${json.verified ? verifiedUser() : ""}`
    $("pfp").src = json.pfp
    var content = ""
    if (htmlers.indexOf(json.poster) != -1) {
        content = emojify(json.content)
    } else {
        content = emojify(sanetize(json.content))
    }
    content = greenify(content)
    $("content").innerHTML = content
    $("date").innerText = json.postdate
    // done //
    $("loader").style.display = "none"
    $("post").style.display = ""
}).catch((err) => { console.log(err) })