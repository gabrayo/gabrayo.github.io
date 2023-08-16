async function injectQualList(elem, after) {
    try {
        const response = await fetch("./about/quallist.html");
        if (!response.ok) {
            console.log("No response");
            return;
        }
        const text = await response.text();

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
        after();
    } catch (err) {
        console.error(err.message);
    }
}

function SetUpQualList(quallist) {
    for (i = 0; i < quallist.children.length; i++) {
        var child = quallist.children[i];
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
    console.log(input.value);
    
    var searchstring = input.value.toLowerCase();
    
    for (i = 0; i < quallist.children.length; i++) {
        var child = quallist.children[i].children[1];
        var rawtext = child.innerHTML;

        if (searchstring == "" || rawtext.toLowerCase().includes(searchstring)) {
            $(quallist.children[i]).addClass("active");

            if (searchstring != "") {
                splittext = rawtext.toLowerCase().split(searchstring)

                var lengthbefore = 0;
                var resultanttext = "";
                for (o = 0; o < splittext.length; o++) {
                    resultanttext += rawtext.substring(lengthbefore, lengthbefore + splittext[o].length);
                    lengthbefore += splittext[o].length;

                    resultanttext += '<span class="w3-text-white">' + rawtext.substring(lengthbefore, lengthbefore + searchstring.length) + '</span>';
                    lengthbefore += searchstring.length;
                }
                child.innerHTML = resultanttext;
            }
        } else {
            $(quallist.children[i]).removeClass("active");
        }
    }
}

$(document).ready(function () {
    var quallist = document.getElementById("qualList");
    injectQualList(quallist, function () {
        SetUpQualList(quallist);

        $(document).on('input', "#qualSearch", function () {
            var input = document.getElementById('qualSearch');
            UpdateSearchBox(input, quallist);
        });
    });
});