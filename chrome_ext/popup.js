// // POST url to server using XMLHttpRequest
// function sendBookmark(url, title) {
//   console.log('SEND BOOKMARK FUNCTION BEING CALLED');
//   var params = '?url=' + url + '&title=' + title;

//   // The URL to post our data to
//   var postUrl = "http://localhost:3000/user/post/storeClip" + params;

//   // Set up an async POST Request
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', postUrl, true);

//   // Send the request
//   xhr.send(params);
// }

// // On click, get open tabs url
// chrome.browserAction.onClicked.addListener(function(tab) {
//   var tabUrl = tab.url;
//   var tabTitle = tab.title;

//   chrome.windows.getCurrent(function(win) {
//   console.log('INSIDE getCurrent');
//     chrome.tabs.captureVisibleTab(win.id, {"format": "png"}, function(imgUrl) {
//       console.log('PREVIEW IMAGE URL : ===============')
//       console.log(imgUrl);
//     });
//   });
//   console.log("tabUrl: ", tabUrl);
//   console.log('tabTitle: ', tabTitle);
//   sendBookmark(tabUrl, tabTitle);
// });
