//*******************************************************************
// Helper Functions
//*******************************************************************

// POST data to server using XMLHttpRequest
function sendBookmark(url, title) {
  var params = '?url=' + url + '&title=' + title;

  // The URL to post our data to
  var postUrl = "http://localhost:3000/user/post/storeClip" + params;

  // Set up an async AJAX POST request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);

  // Send the request
  xhr.send(params);
}

// Send all existing bookmarks to server
function sendAllBookmarks(bookmarkObj) {
  console.log('placeholder');
}

//*******************************************************************
// Event Listeners
//*******************************************************************

// On click, get open tabs url
chrome.browserAction.onClicked.addListener(function(tab) {
  var tabUrl = tab.url;
  var tabTitle = tab.title;
  console.log("tabUrl: ", tabUrl);
  console.log('tabTitle: ', tabTitle);
  sendBookmark(tabUrl, tabTitle);
});

// On Install, get all bookmarks
chrome.runtime.onInstalled.addListener(function() {
  console.log("bookmark search exporter extension installed");
  var bm_urls = [];
  console.log("bm_urls: ", bm_urls);
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
    console.log(JSON.stringify(bm_urls));
  });
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



