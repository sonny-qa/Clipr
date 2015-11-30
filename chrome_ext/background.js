//*******************************************************************
// Helper Functions
//*******************************************************************

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
                var bkmrkObj = {};

                bkmrkObj.email = userInfo.email;
                resolve(bkmrkObj);
            });
        });
    };
    //triiger out auth request immediately upon chrome ext
    x.send();
});

//--------sends creates a bookmark from the current tab & sends to server. expects user email
function sendBookmark(bkmrkObj) {

    //NOTE change this to https://clipr-app-1.herokuapp.com for heroku
    // var website = "https://clipr-app-1.herokuapp.com";
    var website = "http://localhost:3000";
    var postUrl = website + "/user/post/storeclip";

    //var params = '?url=' + url + '&title=' + title.toString() + '&email=' + email.toString();

    // Set up an async POST Request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Send the request
    console.log('sending bkmrkobj',bkmrkObj);
    xhr.send(bkmrkObj);
}


//*******************************************************************
// Event Listeners
//*******************************************************************

//listener for sending in new bookmark
chrome.browserAction.onClicked.addListener(function(tab) {

    //check auth first to get email
    checkAuth.then(function(bkmrkObj) {

        //set tab info from current tab onto bkmrkobj
        bkmrkObj.url = tab.url;
        bkmrkObj.title = tab.title;

        console.log('sending in ext',bkmrkObj);

        //stringify immediately before send
        sendBookmark(JSON.stringify(bkmrkObj));

    });
});

//On Install, get all chrome bookmarks

// chrome.runtime.onInstalled.addListener(function(){

//   var bm_urls = [];

//   function fetch_bookmarks(parentNode) {
//     parentNode.forEach(function(bookmark) {
//       if (!(bookmark.url === undefined || bookmark.url === null)) {
//         bm_urls.push(bookmark.url);
//     }
//     if (bookmark.children) {
//       fetch_bookmarks(bookmark.children);
//     }
//   });
// }

//   chrome.bookmarks.getTree(function(rootNode) {
//     fetch_bookmarks(rootNode);
//     sendAllBookmarks(JSON.stringify(bm_urls));
//   });
// });