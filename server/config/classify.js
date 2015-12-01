var app = require('../server.js');
var natural = require('natural');
var fs = require('fs');

classifier = new natural.BayesClassifier();


fs.readFile('./server/config/trainingDocs/tech1.txt', function(err, data) {
  if (err) {
    return console.log(err);
  }
var text;



})



classifier.addDocument('basketball baseball', 'Sports');
classifier.addDocument('movies art', 'Entertainment');
classifier.addDocument('chemistry, computers, biology', 'Science/Technology');
classifier.addDocument('money, start up, business', 'Business');
classifier.addDocument('terrorists, world, america', 'News');
classifier.addDocument('learning, class, school', 'Education');
classifier.addDocument('love, children, home', 'Family');
classifier.addDocument('recipe, pizza, drinks, restaurant', 'Food');
classifier.addDocument('running, fitness, health', 'Health');
classifier.addDocument('dog, cat, bird, pet', 'Pets');
classifier.addDocument('democrat, republican, trump, clinton', 'Politics');
classifier.addDocument('airplane, flight, hotel, car, vacation', 'Travel');
classifier.addDocument('buy, clothing, store', 'Shopping');

module.exports = {

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
    classifier.train();

  }
}