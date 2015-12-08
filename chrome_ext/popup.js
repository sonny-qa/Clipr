document.addEventListener('DOMContentLoaded', function() {

    //send a message to indicate a click
    chrome.runtime.sendMessage({
        clicked: true
    }, function(response) {
        document.getElementById("statusMessage").innerHTML = response.status;


    });
    //when we receive a response from background, set the popup value to what we receive from background
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        document.getElementById("statusMessage").innerHTML = response.status;
        sendResponse({
            message: 'got it background'
        })

    })

});