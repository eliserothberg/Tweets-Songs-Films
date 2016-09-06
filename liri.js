var SpotifyWebApi = require('spotify-web-api-node');
var twitter = require('twitter');
var request = require('request');
var omdb = require('omdb');
var fs = require("fs");

var tKeys = require("../liri-node-app/keys.js");

var spotifyApi = new SpotifyWebApi({
  clientId : 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret : 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri : 'http://www.example.com/callback'
});

var userT = new twitter ({
  consumer_key: tKeys.consumer_key,
  consumer_secret: tKeys.consumer_secret,
  access_token_key: tKeys.access_token_key,
  access_token_secret: tKeys.access_token_secret,
  });

var userChoice = process.argv.slice(3);
var uOption = process.argv.slice(2);
var userOption = uOption[0];
var part1 = [];
var part2 = [];
var randomChoice;
var postDate = [];
var year = [];
var tweetRandom;
var randomLine;
var randomArray;

//If 'do-what-it-says' entered, get random instruction from the random.txt page
function randomThis() {

  if (userOption === 'do-what-it-says') {

    fs.readFile("random.txt", "utf8", function (error, data) {
    
    if(error) throw error;
    //randomize line
    var lines = data.split('\n');
    randomLine = lines[Math.floor(Math.random()*lines.length)];
    // console.log("here's the random line: " + randomLine);
    //split array by comma into option and choice
    randomArray = randomLine.split(",");
    // console.log("randomArray0 = " + randomArray[0]);
    // console.log("randomArray1 = " + randomArray[1]);
     
    userOption = randomArray[0];
    randomChoice = randomArray[1];
    //assign query to proper area
      if (userOption == 'spotify-this-song') {
        spotifyThis();
      }

      else if (userOption == 'movie-this') {
        movieThis();
      }
      if (userOption == 'my-tweets') {
        tweetThis();
      } 
    });
  };
};
        // console.log("randomChoice # 3 = " + randomChoice);
        // console.log("userOption # 3 = " + userOption);
        // console.log("tweetRandom2 = " + tweetRandom);

randomThis();
//If movie chosen:
function movieThis() {
    //Process choice and send query:
  if (userOption === 'movie-this' && userChoice != null){

    userChoice = process.argv.slice(3).join("+");

    // Request to the OMDB API with the movie specified 
    var queryUrl = 'http://www.omdbapi.com/?t=' + userChoice +'&y=&plot=short&tomatoes=true&r=json';

    //if no choice is selected, send this request:
    if (userOption === 'movie-this' && userChoice == '') {
    userChoice = 'Mr Nobody';
      var queryUrl = 'http://www.omdbapi.com/?t=' + userChoice +'&y=&plot=short&tomatoes=true&r=json';
    }
    //if random.txt choice is selected, do this:
     if (userOption === 'movie-this' && randomChoice != null) {
      userChoice = ("'" + randomChoice + "'");
      var queryUrl = 'http://www.omdbapi.com/?t=' + userChoice +'&y=&plot=short&tomatoes=true&r=json';
    }

      request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        
        
        var addMovie = ("Title: " + JSON.parse(body)["Title"]+ "\n" + "Year: "
        + JSON.parse(body)["Year"]+ "\n"
        + "IMDb Rating: " + JSON.parse(body)["imdbRating"] + "\n" 
        + "Country: " + JSON.parse(body)["Country"]+ "\n"
        + "Language: " + JSON.parse(body)["Language"]+ "\n"
        + "Plot: " + JSON.parse(body)["Plot"]+ "\n"
        + "Actors: " + JSON.parse(body)["Actors"]+ "\n" 
        + "Rotten Tomato Rating: " + JSON.parse(body)["tomatoRating"]+ "\n"
        + "Rotten Tomato URL: " + JSON.parse(body)["tomatoURL"]+ "\n");
         //print out response
         console.log(addMovie);
       }
        //add response to log
          fs.appendFile('log.txt', addMovie, function (err) {

          });
      });  
    };
  };

movieThis();
//if song chosen:
function spotifyThis() {

  if (userOption === 'spotify-this-song' && userChoice !== null) {
    //if no song chosen:
    if (userOption === 'spotify-this-song' && userChoice == '') {
        userChoice = 'The Sign';
    }
    //if song chosen from random.txt:
    if (userOption === 'spotify-this-song' && randomChoice != null) {
    userChoice = ("'" + randomChoice + "'");
    }
    //send query
    spotifyApi.searchTracks('"' + userChoice + '"')
      .then(function(data) {

      var songInfo = data.body.tracks.items[0];

      var addSong = ("Artist Name: " + songInfo.artists[0].name + "\n"
      + "Song Title: " + songInfo.name + "\n"
      + "Link to url: " + songInfo.preview_url + "\n"
      + "Album: " + songInfo.album.name + "\n");
      //print out data
      console.log(addSong);
      //add data to log
      fs.appendFile('log.txt', addSong, function (err) {
      });
    }, 
    function(err) {
      console.error(err);
    });
  };
};
spotifyThis();
//if tweets are chosen:
function tweetThis() {
    
  if (userOption == 'my-tweets') {
    //request 20 tweets from me
    userT.get('statuses/user_timeline', {screen_name: 'elise_rothberg', 
      count: 20}, function(error, tweets, response) {
      
      if (!error) {

        for (var i=0; i<tweets.length; i++){
          var thisTweet = tweets[i];
           //get the day, day of the month, and month  
          for (k=0; k<11; k++) {
            postDate += thisTweet.created_at[k];
          }
          //get the year
          for (m=26; m<30; m++) {
            year += thisTweet.created_at[m];
          }
              
          var addTweets = ("Tweet: " + tweets[i].text + "\n"
          + "Posted: " + postDate + year + "\n" + "\n");
          //print out data
          console.log(addTweets);
          //add to log
          fs.appendFile('log.txt', addTweets, function (err) {
          });
          //clear date information
          postDate = [];
          year = [];
        };
      }
    });
  }
};

tweetThis();
//add what was typed into the console to the log file
var addToFile = ("\n" + "Entered in console: " + process.argv.slice(2) + "\n" + "\n");
fs.appendFile('log.txt', addToFile, function (err) {
});