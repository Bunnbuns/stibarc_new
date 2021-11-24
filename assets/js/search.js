function search(query) {
    fetch(`${rootAPI}/v3/postsearch.sjs`,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `q=${encodeURIComponent(query)}`
        }).then(response => response.json()).then((json) => {
            var html = ""
            for (var i in json) {
                html += toBlock(i, json[i])
            }
            $("posts").innerHTML = html
        }).catch((err) => { console.log(err) });
}

window.onload = function () {
    $("mobile-q").onkeyup = function (e) {
        if (e.key == "Enter") {
            var query = $("mobile-q").value;
            $("q").value = query;
            if (query != "") {
                search(query);
            }
        }
    }
    if (getAllUrlParams().q != undefined && getAllUrlParams().q != "") {
        $("q").value = getAllUrlParams().q;
        $("mobile-q").value = getAllUrlParams().q;
        search(getAllUrlParams().q);
    }
}