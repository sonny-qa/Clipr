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
function sendBookmark(bkmrkObj,cb) {

    //NOTE change this to https://clipr-app-1.herokuapp.com for heroku
    // var website = "https://clipr-app-1.herokuapp.com";
    var website = "http://localhost:3000";
    var postUrl = website + "/user/post/storeclip";

    //var params = '?url=' + url + '&title=' + title.toString() + '&email=' + email.toString();

    // Set up an async POST Request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(e){
        //var events = JSON.parse(this.responseText)
        //console.log('response....',e.target.responseText)
        var resp = e.target.responseText;
        cb(resp)
    }

    // Send the request

    console.log('sending bkmrkobj', bkmrkObj);

    xhr.send(bkmrkObj);
}

var getPageText = function(bkmrkObj, cb) {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            message: "getText"
        }, function(response) {

            //remove new line characters before sending over to server
            bkmrkObj.text = response.data.replace(/\n/g, "")

            console.log('the response', response);

            cb(bkmrkObj);
        });
    });

};


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //when receving a message from popup.js, this indicates click has happened, so start the process...
        if (request.clicked) {

            //collect tab data
            chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function(tabs) {
                    tab = tabs[0]

                    checkAuth.then(function(bkmrkObj) {

                        //set tab info from current tab onto bkmrkobj
                        bkmrkObj.url = tab.url;
                        bkmrkObj.title = tab.title;
                        bkmrkObj.timeAdded = Date.now()


                        //stringify immediately before send
                        getPageText(bkmrkObj, function(data) {
                            console.log('got text', bkmrkObj)
                            sendBookmark(JSON.stringify(data), function(resp) {
                          
                                //we send a message back to the popup controller, with the server's reply
                                 sendResponse({status: resp});

                            })



                        });

                    });

                }



            );
        } return true 
 
    })
