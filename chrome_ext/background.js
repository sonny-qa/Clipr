//*******************************************************************
// Helper Functions
//*******************************************************************

// POST existing chrome bookmarks to server
function sendAllBookmarks(bookmarkObj) {

  // The URL to post our data to
  var postUrl = "http://localhost:3000/user/post/getAllBookmarks";

  // Set up an async POST Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Convert to JSON
  var sendData = JSON.stringify(bookmarkObj);

  // console.log("Im the bookmark obj: ", bookmarkObj);
  // Send the request
  xhr.send(bookmarkObj);
}

//*******************************************************************
// Event Listeners
//*******************************************************************
// POST url to server using XMLHttpRequest
function sendBookmark(url, title, imgUrl) {
  console.log('SEND BOOKMARK FUNCTION BEING CALLED');
  console.log('imgUrl', imgUrl);

  var params = {
    url: url,
    title: title,
    imgUrl: imgUrl
  };
  // The URL to post our data to
  var postUrl = "http://localhost:3000/user/post/storeclip";

  // Set up an async POST Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  // Send the request
  xhr.send(JSON.stringify(params));
}

// On Install, get all chrome bookmarks
chrome.runtime.onInstalled.addListener(function() {

  var bm_urls = [];

  function fetch_bookmarks(parentNode) {
    parentNode.forEach(function(bookmark) {
      if(!(bookmark.url === undefined || bookmark.url === null)) {
        bm_urls.push(bookmark.url);
      }
      if(bookmark.children) {
        fetch_bookmarks(bookmark.children);
      }
    });
  }

  chrome.bookmarks.getTree(function(rootNode) {
    fetch_bookmarks(rootNode);
    // console.log("Stringifed Array: ", JSON.stringify(bm_urls));
    sendAllBookmarks(JSON.stringify(bm_urls));
  });
});

// On click, get open tabs url
chrome.browserAction.onClicked.addListener(function(tab) {

  console.log('Inside Click Handler!');
  var tabUrl = tab.url;
  var tabTitle = tab.title;

  chrome.windows.getCurrent(function(win) {
  console.log('INSIDE getCurrent');
    chrome.tabs.captureVisibleTab(win.id, {"format": "png"}, function(imgUrl) {
      console.log('PREVIEW IMAGE URL : ===============');
      console.log(imgUrl);
      var tabImgUrl = imgUrl;
      console.log('INSIDE CHROME EXT CALLBACK');
      sendBookmark(tabUrl, tabTitle, tabImgUrl);
    });
  });

  console.log("tabUrl: ", tabUrl);
  console.log('tabTitle: ', tabTitle);

});



// Logs new bookmark url
chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
  console.log("bookmark added.. " + bookmark.url);
});

// Logs deleted bookmark id
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) {
  console.log("bookmark removed.. " + id);
});

// Logs id of changed bookmark
chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
  console.log("bookmark changed.. " + id);
});



