const QualListId = "qualList";

function InjectManifest(text) {
    var elem = document.getElementById(QualListId);
    var lines = text.split("\n");

    for (i = 0; i < lines.length; i++) {
        var curLine = lines[i];

        if (curLine[0] == '+') {
            elem.innerHTML += "<p>" + curLine[0] + "<span>" + curLine.substring(1) + "</span></p>";
        }
        else {
            elem.innerHTML += "<p><span>" + curLine + "</span></p>";
        }
    }

    for (i = 0; i < elem.children.length; i++) {
        var child = elem.children[i];
        $(child).addClass("active");

        var qualified = false;
        if (child.innerHTML[0] == '+') {
            child.innerHTML = child.innerHTML.substring(1);
            qualified = true;
        }

        if (qualified)
            child.innerHTML = '<i class="fa fa-check"></i>' + child.innerHTML;
        else
            child.innerHTML = '<i class="fa fa-times"></i>' + child.innerHTML;
    }
}

function UpdateSearchBox(input, quallist) {
    var searchstring = input.value.toLowerCase();

    for (c = 0; c < quallist.children.length; c++) {

        var child = quallist.children[c].children[1];
        var rawtext = GetRawInnerText(child.innerHTML);

        if (searchstring == "" || rawtext.toLowerCase().includes(searchstring)) {

            SetActive(quallist.children[c], true);
            var resultanttext = "";

            if (searchstring != "") {
                splittext = rawtext.toLowerCase().split(searchstring)

                var lengthbefore = 0;
                for (o = 0; o < splittext.length; o++) {
                    resultanttext += rawtext.substring(lengthbefore, lengthbefore + splittext[o].length);
                    lengthbefore += splittext[o].length;

                    resultanttext += '<span class="w3-text-highcolor">' + rawtext.substring(lengthbefore, lengthbefore + searchstring.length) + '</span>';
                    lengthbefore += searchstring.length;
                }
            }
            else {
                resultanttext = rawtext;
            }

            child.innerHTML = resultanttext;
        } else {
            SetActive(quallist.children[c], false);
            console.log("Removed" + quallist.children[c]);
        }
    }
}

function InjectSkillList(text) {
    var elem = document.getElementById("skills");
    var lines = text.split("\n");

    for (i = 0; i < lines.length; i += 2) {
        var curLine = lines[i];
        var curPercent = lines[i + 1];

        elem.innerHTML +=
            '<p class="w3-wide">' +
            curLine.trim() +
            '</p><div class="w3-secondarycolor"><div style="height:28px;width:' +
            curPercent.trim() +
            "%\"><div class=\"w3-midcolor dynamicvisibility widthfade\"></div></div></div>"
            ;
    }
}

function InjectInvolvements(text) {
    var elem = document.getElementById("achievements");
    var lines = text.split("\n");
    var newHTML = "";

    for (i = 0; i < lines.length; i++) {
        if (lines[i].includes(">>>")) {

            if (i > 0) {
                newHTML += "</div></div>";
            }

            newHTML +=
                '<div class="w3-border w3-primarycolor w3-margin-top">' +
                '<div class="w3-left-align w3-block w3-padding w3-padding-16 w3-hover-secondarycolor collapsibleButton w3-wide dynamicvisibility simplefade">' +
                lines[i].substring(3) +
                '</div>' +
                '<div class="content">' +
                '<hr style="width:200px" class="w3-margin w3-translucent">';
        }
        else {
            newHTML +=
                '<div class="w3-padding">' +
                '<img src="about/expimgs/' +
                lines[i].trim() +
                '" alt="Avatar"' +
                'class="w3-left w3-circle w3-margin-right" style="width:80px">' +
                '<div style="margin-left:100px">' +
                '<p><span class="w3-large w3-margin-right w3-text-highcolor">' +
                lines[i + 1].trim() +
                '</span>' +
                lines[i + 2].trim() + '</p>' +
                '<p>' +
                lines[i + 3].trim() + '</p><br></div></div>';

            i += 3;
        }
    }

    elem.innerHTML += newHTML;
}

function InjectLanguage(text) {
    var elem = document.getElementById("language");
    var lines = text.split("\n");

    for (i = 0; i < lines.length; i += 2) {
        elem.innerHTML +=
        '<div class="w3-quarter w3-section pie dynamicvisibility" style="--p:' + 
        lines[i] +
        ';--c:white;--b:15px">' +
        lines[i + 1] +
        '</div>';
    }
}

function InjectProjects(text){
    var elem = document.getElementById("projects");
    var lines = text.split("\n");
    var newHTML = "";

    for (i = 0; i < lines.length; i += 6) {
        newHTML += '<div class="w3-third w3-text-highcolor">';
        newHTML +=
                '<div class="w3-border w3-margin-top">' +
                '<div class="w3-left-align w3-block w3-padding w3-padding-16 w3-hover-secondarycolor collapsibleButton w3-wide dynamicvisibility simplefade">' +
                "Show Set " + ((i / 6) + 1) +
                '</div>';

        newHTML += '<div class="content">' +
        '<div class="w3-padding">' +
        '<hr style="width:200px" class="w3-translucent">';

        for (c = 0; c < 6; c += 3) {
            if(lines.length > i + c + 2){
            newHTML +=
                '<div class="w3-margin-top dynamicvisibility simplefade">' +
                '<div class="w3-border toggleable flipbox">' +
                '<img src="images/' +
                lines[i + c] +
                '" style="width:100%">' +
                '<span><a href="' +
                lines[i + c + 1] +
                '"' +
                'target=”_blank”>' +
                lines[i + c + 2] +
                '</a></span>' +
                '</div>' +
                '</div>';
            }

        }
        newHTML +=
        '</div>' + 
        '</div></div></div>';
    }

    elem.innerHTML = newHTML;
}

$(document).ready(function () {
    setTimeout(function () {

        QInject("./about/quallist.txt", InjectManifest);

        $("#qualSearch").on("input", function () {
            UpdateSearchBox(document.getElementById('qualSearch'), document.getElementById(QualListId));
        });

        QInject("./about/skills.txt", InjectSkillList);
        QInject("./about/involvements.txt", InjectInvolvements);
        QInject("./about/language.txt", InjectLanguage);
        QInject("./about/projects.txt", InjectProjects)

        setTimeout(UpdateDynamicVisObjs, 150);
    }, 150);
});