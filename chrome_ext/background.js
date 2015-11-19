//*******************************************************************
// Helper Functions
//*******************************************************************

<<<<<<< HEAD
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

  var params = '?url=' + url + '&title=' + title;
  // The URL to post our data to
  var postUrl = "http://localhost:3000/user/post/storeclip" + params;

  // Set up an async POST Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', postUrl, true);
  // xhr.setRequestHeader('Content-Type', 'application/json');
  // Send the request
  xhr.send(params);
}

// On Install, get all chrome bookmarks

// chrome.runtime.onInstalled.addListener(function() {
  
//   var bm_urls = [];

//   function fetch_bookmarks(parentNode) {
//     parentNode.forEach(function(bookmark) {
//       if(!(bookmark.url === undefined || bookmark.url === null)) {
//         bm_urls.push(bookmark.url);
//       }
//       if(bookmark.children) {
//         fetch_bookmarks(bookmark.children);
//       }
//     });    
//   }

//   chrome.bookmarks.getTree(function(rootNode) {
//     fetch_bookmarks(rootNode);
//     console.log("Stringifed Array: ", JSON.stringify(bm_urls));
//     sendAllBookmarks(JSON.stringify(bm_urls));
//   });
// });

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
=======

//listener for sending in new bookmark
chrome.browserAction.onClicked.addListener(function(tab) {

    //check auth first to get email
    checkAuth.then(function(bkmrkObj) {

        //set tab info from current tab onto bkmrkobj
        bkmrkObj.url = tab.url;
        bkmrkObj.title = tab.title;

        getPageImg(bkmrkObj,function(data){
          //stringify immediately before send
          sendBookmark(JSON.stringify(data))})

        })
})


//------Promisified check auth function to be run first
var checkAuth = new Promise(function(resolve, reject) {
    //instantiate an XML request object
    var x = new XMLHttpRequest();
    //make a get request to the google oAuth2.0 endpoint...
    x.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=');
    x.onload = function() {
        //based on our credentials saved in manifest.json, google send us back a token with the requested user scopes
        chrome.identity.getAuthToken({
            interactive: true
                //this flag causes a google login to appear if the user is not already signed in
        }, function(token) {
            if (chrome.runtime.lastError) {
                alert(chrome.runtime.lastError.message);
                reject('could not get user email');
            }
            //alert('the token' + token)
            // async callback, once the user has signed in, we can request profile info...
            chrome.identity.getProfileUserInfo(function(userInfo) {
                //attach email property, requested in scope, to the userObj
                var bkmrkObj = {}

                bkmrkObj.email = userInfo.email
                resolve(bkmrkObj)
            });
        });
    };
    //triiger out auth request immediately upon chrome ext
    x.send();

})

//--------sends creates a bookmark from the current tab & sends to server. expects user email
function sendBookmark(bkmrkObj) {

    var website = "http://localhost:3000";
    var postUrl = website + "/user/post/storeclip";

    //var params = '?url=' + url + '&title=' + title.toString() + '&email=' + email.toString();

    //var postUrl = "http://localhost:3000/user/post/storeclip" + params;

    // Set up an async POST Request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // xhr.setRequestHeader('Content-Type', 'application/json');
    // Send the request
    console.log('sending bkmrkobj',bkmrkObj)
    xhr.send(bkmrkObj);
}

//this is disabled for now as it seems to be slowing things down?
var getPageImg = function(bkmrkObj,cb) {

    chrome.windows.getCurrent(function(win) {
        chrome.tabs.captureVisibleTab(win.id, {"format": "jpeg", "quality": 10
        }, function(imgUrl) {

            //disabled this for now
            bkmrkObj.imgUrl = "";
          
            
            cb(bkmrkObj)

        });

        
    });

};


>>>>>>> [chore]: Refactor chrome_ext to move sendBookmark function into popup.js



