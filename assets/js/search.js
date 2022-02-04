function search(query) {
    var searchQuery = {}
    searchQuery["q"] = query
    fetch(`${rootAPI}/v3/postsearch.sjs`,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: serialize(searchQuery)
        }).then(response => response.json()).then((json) => {
            var html = ""
            if (isEmpty(json)) {
                html = `<h2 class="title size-2">No results</h2>`
            }
            for (var i in json) {
                html += toBlock(i, json[i])
            }
            $("posts").innerHTML = html
        }).catch((err) => { console.log(err) });
}

function searchFromUrl() {
    var query = getAllUrlParams().q
    if (query != undefined && query != "") {
        $("q").value = decodeURI(query)
        $("mobile-q").value = decodeURI(query)
        search(query)
    }
}

window.onload = function () {
    $("q").onkeyup = function (e) {
        if (e.key == "Enter") {
            var query = $("q").value
            if (query != "") {
                window.location = `./search.html?q=${encodeURIComponent(query)}`
            }
        }
    }
    $("mobile-q").onkeyup = function (e) {
        if (e.key == "Enter") {
            var query = $("mobile-q").value
            $("q").value = query
            window.location = `./search.html?q=${encodeURIComponent(query)}`
        }
    }
    searchFromUrl()
}
