function InjectManifest(text) {
    var elem = document.getElementById("searchresults");
    var lines = text.split("\n");

    for (i = 1; i < lines.length; i += 3) {
        elem.innerHTML +=
            '<br>' +
            '<a href="blog/pages/' + lines[i] + '.html"><div class="w3-container w3-border w3-hover-grey">' +
            '<h3>' + lines[i + 1] + '</h3>' +
            '<p>' + lines[i + 2] + '</p>' +
            '</div></a>';
    }
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
        QInject("./blog/manifest.txt", InjectManifest);

        setTimeout(function () {
            UpdateDynamicVisObjs();
        }, 200);

    }, 150);
});