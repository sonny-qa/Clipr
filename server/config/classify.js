var app = require('../server.js');
var natural = require('natural');
var fs = require('fs');
var async = require('async');

// classifier = new natural.BayesClassifier();




// // // techStream.on('end', function() {
// //   classifier.addDocument(data, 'Science/Technology')
// //   classifier.train();
// // });

// // 'sports.txt', 'entertainment.txt', 'business.txt', 
// var files = ['tech.txt', 'news.txt']
//   // 'Sports', 'Entertainment', 'Business', 
// var labels = ['Science/Technology', 'News']

// var readAsync = function(file, callback) {
//   longFile = './server/config/trainingDocs/' + file
//   console.log('file:', longFile)
//   fs.readFile(longFile, 'utf8', callback);
// }
// async.map(files, readAsync, function(err, results) {
//   // console.log('files', files)
//   // console.log('results', results);
//   for (var i = 0; i < results.length; i++) {
//     classifier.addDocument(results[i], labels[i])
//   }
//   classifier.train()

// })

// classifier.addDocument('basketball baseball', 'Sports');
// classifier.addDocument('movies art', 'Entertainment');
// classifier.addDocument('chemistry, computers, biology', 'Science/Technology');
// classifier.addDocument('money, start up, business', 'Business');
// classifier.addDocument('terrorists, world, america', 'News');
// classifier.addDocument('learning, class, school', 'Education');
// classifier.addDocument('love, children, home', 'Family');
// classifier.addDocument('recipe, pizza, drinks, restaurant', 'Food');
// classifier.addDocument('running, fitness, health', 'Health');
// classifier.addDocument('dog, cat, bird, pet', 'Pets');
// classifier.addDocument('democrat, republican, trump, clinton', 'Politics');
// classifier.addDocument('airplane, flight, hotel, car, vacation', 'Travel');
// classifier.addDocument('buy, clothing, store', 'Shopping');

module.exports = {

  loadClassifier: function() {
    natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
      console.log(classifier.classify('computers are good i like technology'))
      console.log(classifier.classify('i love news hilary clinton'))
    })
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