chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 
    if (request.message == "getText") {
        sendResponse({
            data: document.all[0].innerText
        });
    }
});