var app = require('../server.js');
var natural = require('natural');
var fs = require('fs');
// var async = require('async');
 

  classifier = new natural.BayesClassifier();


// var files = ['tech.txt', 'news.txt', 'entertainment.txt', 'politics.txt', 'food.txt', 'sports.txt', 'travel.txt', 'business.txt', 'shopping.txt']

// var labels = ['Science/Technology', 'News', 'Entertainment', 'Politics', 'Food', 'Sports', 'Travel', 'Business', 'Shopping']

// var readAsync = function(file, callback) {
//   longFile = './server/config/trainingDocs/' + file
//   console.log('file:', longFile)
//   fs.readFile(longFile, 'utf8', callback);
// }
// async.map(files, readAsync, function(err, results) {
//   for (var i = 0; i < results.length; i++) {
//     classifier.addDocument(results[i], labels[i])
//   }
//   classifier.train()

// })



module.exports = {

  loadClassifier: function() {
  

    natural.BayesClassifier.load('../classifier.json', null, function(err, classifier) {

      console.log(classifier.classify("hilary clinton"))
});
  },

  trainClassifier: function() {
    console.log('trainin dis classifier')

    classifier.events.on('trainedWithDocument', function(obj) {
      console.log(obj);
      if (obj.index === obj.total - 1) {
        classifier.save('classifier.json', function(err, classifier) {
          console.log('classifier has been saved')
        })
      }
    })
  }
}