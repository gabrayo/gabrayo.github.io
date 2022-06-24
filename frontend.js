
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

$(document).on("scroll", function () {UpdateDynamicVisObjs();});

