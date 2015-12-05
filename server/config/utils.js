var stopWords = "a,able,about,above,abst,accordance,according,accordingly,across,act,actually,added,adj,\
affected,affecting,affects,after,afterwards,again,against,ah,all,almost,alone,along,already,also,although,\
always,am,among,amongst,an,and,announce,another,any,anybody,anyhow,anymore,anyone,anything,anyway,anyways,\
anywhere,apparently,approximately,are,aren,arent,arise,around,as,aside,ask,asking,at,auth,available,away,awfully,\
b,back,be,became,because,become,becomes,becoming,been,before,beforehand,begin,beginning,beginnings,begins,behind,\
being,believe,below,beside,besides,between,beyond,biol,both,brief,briefly,but,by,c,ca,came,can,cannot,can't,cause,causes,\
certain,certainly,co,com,come,comes,contain,containing,contains,could,couldnt,d,date,did,didn't,different,do,does,doesn't,\
doing,done,don't,down,downwards,due,during,e,each,ed,edu,effect,eg,eight,eighty,either,else,elsewhere,end,ending,enough,\
especially,et,et-al,etc,even,ever,every,everybody,everyone,everything,everywhere,ex,except,f,far,few,ff,fifth,first,five,fix,\
followed,following,follows,for,former,formerly,forth,found,four,from,further,furthermore,g,gave,get,gets,getting,give,given,gives,\
giving,go,goes,gone,got,gotten,h,had,happens,hardly,has,hasn't,have,haven't,having,he,hed,hence,her,here,hereafter,hereby,herein,\
heres,hereupon,hers,herself,hes,hi,hid,him,himself,his,hither,home,how,howbeit,however,hundred,i,id,ie,if,i'll,im,immediate,\
immediately,importance,important,in,inc,indeed,index,information,instead,into,invention,inward,is,isn't,it,itd,it'll,its,itself,\
i've,j,just,k,keep,keeps,kept,kg,km,know,known,knows,l,largely,last,lately,later,latter,latterly,least,less,lest,let,lets,like,\
liked,likely,line,little,'ll,look,looking,looks,ltd,m,made,mainly,make,makes,many,may,maybe,me,mean,means,meantime,meanwhile,\
merely,mg,might,million,miss,ml,more,moreover,most,mostly,mr,mrs,much,mug,must,my,myself,n,na,name,namely,nay,nd,near,nearly,\
necessarily,necessary,need,needs,neither,never,nevertheless,new,next,nine,ninety,no,nobody,non,none,nonetheless,noone,nor,\
normally,nos,not,noted,nothing,now,nowhere,o,obtain,obtained,obviously,of,off,often,oh,ok,okay,old,omitted,on,once,one,ones,\
only,onto,or,ord,other,others,otherwise,ought,our,ours,ourselves,out,outside,over,overall,owing,own,p,page,pages,part,\
particular,particularly,past,per,perhaps,placed,please,plus,poorly,possible,possibly,potentially,pp,predominantly,present,\
previously,primarily,probably,promptly,proud,provides,put,q,que,quickly,quite,qv,r,ran,rather,rd,re,readily,really,recent,\
recently,ref,refs,regarding,regardless,regards,related,relatively,research,respectively,resulted,resulting,results,right,run,s,\
said,same,saw,say,saying,says,sec,section,see,seeing,seem,seemed,seeming,seems,seen,self,selves,sent,seven,several,shall,she,shed,\
she'll,shes,should,shouldn't,show,showed,shown,showns,shows,significant,significantly,similar,similarly,since,six,slightly,so,\
some,somebody,somehow,someone,somethan,something,sometime,sometimes,somewhat,somewhere,soon,sorry,specifically,specified,specify,\
specifying,still,stop,strongly,sub,substantially,successfully,such,sufficiently,suggest,sup,sure,t,take,taken,taking,tell,tends,\
th,than,thank,thanks,thanx,that,that'll,thats,that've,the,their,theirs,them,themselves,then,thence,there,thereafter,thereby,\
thered,therefore,therein,there'll,thereof,therere,theres,thereto,thereupon,there've,these,they,theyd,they'll,theyre,they've,\
think,this,those,thou,though,thoughh,thousand,throug,through,throughout,thru,thus,til,tip,to,together,too,took,toward,towards,\
tried,tries,truly,try,trying,ts,twice,two,u,un,under,unfortunately,unless,unlike,unlikely,until,unto,up,upon,ups,us,use,used,\
useful,usefully,usefulness,uses,using,usually,v,value,various,'ve,very,via,viz,vol,vols,vs,w,want,wants,was,wasn't,way,we,wed,\
welcome,we'll,went,were,weren't,we've,what,whatever,what'll,whats,when,whence,whenever,where,whereafter,whereas,whereby,wherein,\
wheres,whereupon,wherever,whether,which,while,whim,whither,who,whod,whoever,whole,who'll,whom,whomever,whos,whose,why,widely,\
willing,wish,with,within,without,won't,words,world,would,wouldn't,www,x,y,yes,yet,you,youd,you'll,your,youre,yours,yourself,\
yourselves,you've,z,zero";

// DB HELPER FUNCTIONS
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var app = require('../server.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var Promise = require('bluebird');
var request = require('request');
var http = require('http');
var urlImage = require('url-to-image');
var cloudinary = require('cloudinary');
var natural = require('natural');

var website = (process.env.SITE || "http://localhost:3000");
if (website === "http://localhost:3000") {
    var apiKeys = require('../../APIs.js');
}

//fetches a user node based on an email
var db= require('seraph')({
  server: "http://clipr.sb02.stations.graphenedb.com:24789",
  user: "clipr",
  pass: 'oSvInWIWVVCQIbxLbfTu'
});

// initialize cloudinary connection for storing and retreiving images
//TODO: move apiKeys to apiKeysAndPasswords.js
cloudinary.config({
  cloud_name: 'cjpuskar',
  api_key: '499291937259717',
  api_secret: 'eaGBQyaTw9EKtPG351ZrkTmTMWc'
});

module.exports = {

  fetchUserByEmail: function(email, cb) {
    var cypher = "MATCH (node:User)" +
      " WHERE node.email = " +
      "'" + email + "'" +
      " RETURN node";
    db.query(cypher, function(err, result) {
      if (err) throw err;
      console.log('fetch fetchUserByEmail', result[0]);
      cb(result[0]);
    });
  },

createRelation: function(clip, tag, how, relevance, cb) {
  db.relate(clip, how, tag, {
      relevance: relevance || null
    }, function(err, relationship) {
      // console.log('RELATIONSHIP:', relationship);
      //provide a callback on the clip (the 'from') node
      cb(clip);
    });
  },

  //TODO: move apiKeys to apiKeysAndPasswords.js
  createWatsonUrl: function(url, cb) {
    console.log('inside watson');
    var API = '5770c0482acff843085443bfe94677476ed180e5';
    var baseUrl = 'http://gateway-a.watsonplatform.net/calls/';
    var endUrl = 'url/URLGetRankedKeywords?apikey=' + API + '&outputMode=json&url=';
    var fullUrl = baseUrl + endUrl + url;
    // console.log(fullUrl);
    request(fullUrl, function (err, response, body) {
      var bodyParsed = JSON.parse(body);
      // console.log('WATSON KEYWORDS:', bodyParsed.keywords);
      cb(bodyParsed.keywords);
    });
  },

  storeTags: function(tag, cb) {
    var relevance = tag.tfidf;
  db.save({
      tagName: tag.term
    }, function(err, node) {
      if (err) throw err;
    db.label(node, ['Tag'],
        function(err) {
          if (err) throw err;
          // console.log(node.tagName + " was inserted as a Topic into DB");
          // console.log('TAGNODE:', node);
        });
      cb(node, relevance);
    });
  },

  createSuggestionNode: function(suggestion, cb) {
    //Each suggestion is an object with a title and a url as its property
    db.save({
      suggestionTitle : suggestion.title,
      suggestionUrl : suggestion.url
    }, function (err, node){

      if (err) throw err;
      db.label(node, ['Suggestion'],
        function(err) {
          if (err) throw err;
          console.log('New Suggestion Node Added to Clip!', node);
        });
      cb(node);
    });
  },

  // captures screen image on chrome_ext click
  urlToImage: function(targetUrl, cb) {
    // Options object to pass to urlImage
    var options = {
      width: '640',
      height: '600',
      // Give a short time to load more resources
      requestTimeout: '300'
    };

    // Function to parse url
    var urlapi = require('url');
    var url = urlapi.parse(targetUrl);

    var hostName = url.hostname;
    var fileName = 'tempImg/' + hostName + '.jpg';

    // API call to url-to-image module
    return urlImage(targetUrl, fileName, options).then(function() {
      // Send image to Cloudinary
      cloudinary.uploader.upload(fileName, function(result) {
        // console.log("Cloudinary result url: ", result);
        cb(result.url);
      },
      {
        crop: 'crop',
        width: 640,
        height: 600,
        x: 0,
        y: 0,
        format: "jpg"
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  //Call to FAROO API to get site suggestions
  suggestionsAPI : function(keyword, cb) {
    var farooAPI = process.env.FAROO || apiKeys.FAROO;
    var fullUrl = 'http://www.faroo.com/api?q=' + keyword + '&start=1&length=3&l=en&src=web&i=false&f=json' + farooAPI;

    request(fullUrl, function (err, res, body) {
      if(err) {
        console.log('ERROR inside suggestionsAPI!!');
      }
      var bodyParsed = JSON.parse(body);
      cb(bodyParsed);
    });

  },

  //Removes all filler words from Website Title
  isStopWord : function(word) {
    var regex = new RegExp("\\b"+word+"\\b","i");
    if(stopWords.search(regex) < 0) {
      return false;
    }else {
      return true;
    }
  },

  removeStopWords: function(word) {
    words = new Array();
    isStopWord(word);

    this.replace(/\b[\w]+\b/g,
        function($0) {
          if(!isStopWord($0)) {
            words[words.length] = $0.trim();
          }
        });

    return words.join(" ");
  }

};
