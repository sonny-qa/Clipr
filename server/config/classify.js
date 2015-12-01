var app = require('../server.js');
var natural = require('natural');
var fs = require('fs');
var async = require('async');

// classifier = new natural.BayesClassifier();




// var files = ['tech.txt', 'news.txt', 'entertainment.txt', 'politics.txt', 'food.txt', 'sports.txt', 'travel.txt', 'business.txt', 'shopping.txt']

// var labels = ['Science/Technology', 'News', 'Entertainment', 'Politics', 'Food', 'Sports', 'Travel', 'Business', 'Shopping']

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


// // classifier.addDocument('learning, class, school', 'Education');
// // classifier.addDocument('love, children, home', 'Family');
// // classifier.addDocument('running, fitness, health', 'Health');



module.exports = {

  loadClassifier: function() {
    natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {
      console.log(classifier.getClassifications("SYRACUSE, N.Y. -- Onondaga Community Colleges men's basketball team will play its second game tomorrow since their coach was placed on leave pending the outcome of an investigation into allegations of unspecified misconduct.A former player and a former assistant coach say Dave Pasiak has been a man of high integrity over the 16 seasons he's been OCC's head coach.I dont see any reason for him being on leave, said Tyrone Albright, who was the two-year captain of the team from 2000 to 2002. Hes always been socially conscious. He loves everyone. As long as you have the basketball skills and you're doing what you're supposed to be doing in the classroom, he'll give you the opportunity to wear that jersey."))
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