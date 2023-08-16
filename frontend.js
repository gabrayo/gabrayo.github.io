//#region Togglers
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
//#endregion
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
//#region File Injection
function QInject(filePath, after) {
  ReturnFetch(filePath, after);
}

async function ReturnFetch(filePath, after) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      return;
    }
    const text = await response.text();

    after(text);

  } catch (err) {
    console.error(err.message);
  }
}

function injectHTML(text, elem, position) {
  if (position == -1) {
    elem.innerHTML = text + elem.innerHTML;
  }
  else if (position == 0) {
    elem.innerHTML = text;
  }
  else if (position == 1) {
    elem.innerHTML = elem.innerHTML + text;
  }
}
//#endregion

function GetRawInnerText(text){
  var rawText = "";
  var inTag = false;

  for(i = 0; i < text.length; i++){
    if(text[i] == '<'){
      inTag = true;
    }
  
    if(inTag == false){
      rawText += text[i];
    }

    else if(text[i] == '>'){
      inTag = false;
    }
  }

  return rawText;
}

function SetActive(elem, bool){
  if(bool){
    $(elem).addClass("active");
  }
  else{
    $(elem).removeClass("active");
  }
}

$(document).ready(function () {
  $(document).scroll(function () { UpdateDynamicVisObjs(); });
  console.log("Initialized Scolling Functionality");
  $(document).on('click', ".collapsibleButton", function () { ToggleCollapsible(this); });
  console.log("Initialized Collapsible Functionality");
  $(document).on('click', ".toggleable", function () { ToggleToggleable(this); });
  console.log("Initialized Toggleable Functionality");

  QInject("./foot.html", function (text) { injectHTML(text, document.querySelector("body").children[0], 1); });
  QInject("./head.html", function (text) { injectHTML(text, document.querySelector("body"), -1); });

  UpdateDynamicVisObjs();
});

