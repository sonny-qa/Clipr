chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('content heard a message...', request)
    if (request.message == "getText") {
        sendResponse({
            data: document.all[0].innerText
        });
    }
});

