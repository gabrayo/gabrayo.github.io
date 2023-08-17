function InjectManifest(text) {
    var elem = document.getElementById("searchresults");
    var lines = text.split("\n");

    for (i = 0; i < lines.length; i += 3) {
        elem.innerHTML +=
            '<br>' +
            '<div href="#' + lines[i] + '" class="bloglink w3-container w3-border w3-hover-grey">' +
            '<h3>' + lines[i + 1] + '</h3>' +
            '<p>' + lines[i + 2] + '</p>' +
            '</div>';
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

function InjectMetaDesc(text){
    var lines = text.split("\n");
    document.getElementById("metatitle").innerHTML = lines[0];
    document.getElementById("metadesc").setAttribute("content", lines[1]);
}

$(document).ready(function () {
    var loc = window.location.href;

    if (loc.includes("#")) {
        var postId = loc.split("#")[1];
        $("#search").addClass("w3-hide");
        $("#blogarea").removeClass("w3-hide");

        setTimeout(function () {
            var blogDirectory = "./blog/logs/" + postId + "/blog.txt";
            QInject(blogDirectory, InjectMetaDesc);
            QInject(blogDirectory, InjectBlog);

            window.onhashchange = function () {
                location.reload();
            };
        }, 150);
    }
    else {
        setTimeout(function () {
            QInject("./blog/manifest.txt", InjectManifest);

            setTimeout(function () {
                UpdateDynamicVisObjs();
                $(".bloglink").click(function () {
                    window.location.href = this.getAttribute("href");
                    location.reload();
                });
            }, 150);

        }, 150);
    }
});