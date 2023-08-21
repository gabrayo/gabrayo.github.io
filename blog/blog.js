function InjectManifest(text) {
    var elem = document.getElementById("searchresults");
    elem.innerHTML = text;
}

function InjectBlog(text) {
    var body = document.getElementById("blogbody");
    var lines = text.split("\n");
    document.getElementById("blogtitle").innerHTML = lines[0];
    document.getElementById("blogsubtitle").innerHTML = lines[1];

    for (i = 2; i < lines.length; i++) {
        body.innerHTML += "<p>" + lines[i] + "<p>";
    }
}

function InjectMetaDesc(text) {
    var lines = text.split("\n");
    document.getElementById("metatitle").innerHTML = lines[0];
    document.getElementById("metadesc").setAttribute("content", lines[1]);
}

$(document).ready(function () {
    setTimeout(function () {
        QInject("./blog/searchresults.html", InjectManifest);

        setTimeout(function () {
            UpdateDynamicVisObjs();
        }, 200);

    }, 150);
});