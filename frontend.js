function ToggleCollapsible(elem) {
  elem.classList.toggle("active");
  var content = elem.nextElementSibling;
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }

  setTimeout(UpdateDynamicVisObjs, 150);
}

function ToggleToggleable(elem) {
  elem.classList.toggle("active");
}

function UpdateDynamicVisObjs() {
  let windowheight = $(window).height();

  let pageTop = $(document).scrollTop();
  let pageBottom = pageTop + windowheight;
  let tags = $(".dynamicvisibility");

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    var posTop = $(tag).position().top;
    var height = $(tag).height();

    if (pageTop + (windowheight / 20) < posTop + height && posTop < pageBottom) {
      $(tag).addClass("visible");
    } else {
      $(tag).removeClass("visible");
    }
  }
}

async function injectHTML(filePath, elem, position) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      return;
    }
    const text = await response.text();

    if (position == -1) {
      elem.innerHTML = text + elem.innerHTML;
    }
    else if (position == 0) {
      elem.innerHTML = text;
    }
    else if (position == 1) {
      elem.innerHTML = elem.innerHTML + text;
    }
  } catch (err) {
    console.error(err.message);
  }
}

$(document).ready(function () {
  $(document).scroll(function () { UpdateDynamicVisObjs(); });
  console.log("Initialized Scolling Functionality");
  $(document).on('click', ".collapsibleButton", function () { ToggleCollapsible(this); });
  console.log("Initialized Collapsible Functionality");
  $(document).on('click', ".toggleable", function () { ToggleToggleable(this); });
  console.log("Initialized Toggleable Functionality");

  UpdateDynamicVisObjs();

  injectHTML("./foot.html", document.querySelector("body").children[0], 1);
  injectHTML("./head.html", document.querySelector("body"), -1);
});

