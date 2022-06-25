
//Collapsible Objects Setup
var coll = document.getElementsByClassName("collapsibleButton");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

//Flippable Objects Setup
var coll = document.getElementsByClassName("toggleable");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
  });
}
//qual list Setup
var quallist = document.getElementById("qualList");

for (i = 0; i < quallist.children.length; i++) {
  var child = quallist.children[i];
  var qualified = false;
  if (child.innerHTML[0] == '+') {
    child.innerHTML = child.innerHTML.substring(1);
    qualified = true;
  }

  if (qualified)
    child.innerHTML = '<i class="fa fa-plus-square"></i>' + child.innerHTML;
  else
    child.innerHTML = '<i class="fa fa-minus-square-o"></i>' + child.innerHTML;
}

var input = document.getElementById('qualSearch');
input.addEventListener('input', SearchQuals);
function SearchQuals() {
  var searchstring = input.value;

  for (i = 0; i < quallist.children.length; i++) {
    var child = quallist.children[i];
    if (searchstring == "" || child.innerHTML.toLowerCase().includes(searchstring.toLowerCase())) {
      child.style.display = "block";
    } else {
      child.style.display = "none";
    }
  }
}

//Scroll Visibility
UpdateDynamicVisObjs();

function UpdateDynamicVisObjs() {
  var windowheight = $(window).height();

  var pageTop = $(document).scrollTop();
  var pageBottom = pageTop + windowheight;
  var tags = $(".dynamicvisibility");

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    var posTop = $(tag).position().top;
    var height = $(tag).height();

    if (pageTop < posTop + height && posTop < pageBottom) {
      $(tag).addClass("visible");
    } else {
      $(tag).removeClass("visible");
    }

    console.log(pageTop + "<" + (posTop + height) + "||" + posTop + "<" + pageBottom)
  }
}

$(document).on("scroll", function () { UpdateDynamicVisObjs(); });

