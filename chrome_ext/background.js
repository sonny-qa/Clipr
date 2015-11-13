// POST data to server using XMLHttpRequest
function sendBookmark(url) {

  var params = '?url=' + url;
  
  // The URL to post our data to
  var postUrl = "http://localhost:3000/user/post/storeClip" + params;

  // Set up an async AJAX POST request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);

  // Send the request
  xhr.send(params);
} 

// On click, get open tabs url.
chrome.browserAction.onClicked.addListener(function(tab) {
  var tabUrl = tab.url
  console.log("tabUrl: ", tabUrl);
  sendBookmark(tabUrl);
});

