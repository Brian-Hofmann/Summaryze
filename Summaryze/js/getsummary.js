// Create the HTML element for the popup
var popup = document.createElement("div");
var content = document.createElement("div");
var summarytext = document.createElement("p");
var loadingimage = document.createElement("img");

content.classList.add('popbox-content');

loadingimage.id = 'loading-img';
loadingimage.src = 'media/loading.gif';
var cssImage = "position: center; display: none; height: 50px; width: 50px;";
loadingimage.style.cssText = cssImage;

popup.id = 'pop-up';
var cssPopup = "display: none; margin: 8px; max-width: 500px";
popup.style.cssText = cssPopup;
popup.classList.add('popbox');
popup.appendChild(content);
content.appendChild(loadingimage);
content.appendChild(summarytext);
document.body.appendChild(popup);

function createPopper(target, popupDiv) {
  var popper = new Popper(target, popupDiv, {
    placement: 'auto',
    modifiers: {
      preventOverflow: { enabled: true }
    }
  });
}

// Events to handle API calls and caching of data
const urlCache = {};
$('a').mouseenter(function (ev) {
  var target = $(ev.target);
  createPopper(target, popup);
  popup.style.display = "";

  var url = target.attr("href");
  if (urlCache[url]) {
    summarytext.textContent = urlCache[url].sm_api_content;
    return;
  }

  getSummary(target.attr("href")).then( function (jsonData) {
    summarytext.textContent = jsonData.sm_api_content;
  });
});
$('#pop-up').mouseleave(function (e) {
  popup.style.display = "none";
});
$(window).click(function() {
  popup.style.display = "none";
});
$('#pop-up').click(function(event){
  event.stopPropagation();
});

// Sends the HTTP request to the SMMRY API waiting for a response
function getSummary(url) {
  summarytext.textContent = "";
  $('#loading-img').show();
  return new Promise((resolve, reject) => {
   $.ajax({
     type: 'GET',
     url: `http://192.34.58.154:3000/summary?url=${url}`,
     dataType: 'json',
     success: (jsonData) => {
      urlCache[url] = jsonData;
      resolve(jsonData);
     },
     error: (err) => {
       reject(err)
     },
     complete: () => {
      $('#loading-img').hide();
     }
   });
 })
}
