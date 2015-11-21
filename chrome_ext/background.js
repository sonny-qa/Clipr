//*******************************************************************
// Helper Functions
//*******************************************************************


//listener for sending in new bookmark
chrome.browserAction.onClicked.addListener(function(tab) {

    //check auth first to get email
    checkAuth.then(function(bkmrkObj) {

        //set tab info from current tab onto bkmrkobj
        bkmrkObj.url = tab.url;
        bkmrkObj.title = tab.title;

        //add the page image to the bookmark object, and supply a callback to getPageImg
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
    //triger out auth request immediately upon chrome ext
    x.send();

})

//--------sends creates a bookmark from the current tab & sends to server. expects user email
function sendBookmark(bkmrkObj) {

<<<<<<< HEAD
    //NOTE change this to https://clipr-app-1.herokuapp.com for heroku
=======
    //***NOTE: when hosting on heroku, website variable should be: https://clipr-app-1.herokuapp.com
>>>>>>> [fix] clips now display, added comments to chrome ext, reenabled image capture on ext
    var website = "http://localhost:3000";
    var postUrl = website + "/user/post/storeclip";


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
            bkmrkObj.imgUrl = imgUrl;
          
<<<<<<< HEAD
            //callback for sending bookmark
=======
            //apply callback to bookmark object (callback in our case is the send bookmark function)
>>>>>>> [fix] clips now display, added comments to chrome ext, reenabled image capture on ext
            cb(bkmrkObj)

        });

        
    });

};





