// On click, get open tabs url.
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log("Page url: ", url);
});




// template for future AJAX post request
// jQuery.ajax({
//   type: "POST",
//   url: "http://www.API.com/endpoint", // change this
//   data: {url: url, date: date, clientId: clientId},
//   sucess: function(data) {
//     console.log(data);
//   }
// });