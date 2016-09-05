var SpotifyWebApi = require('spotify-web-api-node');
// var inquirer = require('inquirer');
var twitter = require('twitter');
var request = require('request');
var omdb = require('omdb');
var fs = require("fs");

var tKeys = require("../liri-node-app/keys.js");
var random = require("../liri-node-app/random.txt");

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


// console.log("userChoice = " + userChoice);
// console.log("userOption = " + userOption);
// console.log("uOption = " + uOption);

 // if (userOption == 'do-what-it-says') {

    // get random line from random.txt
  // function getRandom(random, line_no, callback) {
  //   var data = fs.readFileSync('random.txt', 'utf8');
  //   var lines = data.split("\n");
  //   callback(null, lines[+line_no]);
  //   console.log("lines = " + lines);
  //       console.log("data = " + data);

  // }

function randomThis () {
  if (userOption === 'do-what-it-says') {
  
    fs.readFile("random.txt", "utf8", function (error, data) {

      var comma = data.lastIndexOf(",");
      console.log("n =" + comma);

        for (i=1; i<comma -1; i++) {
          part1 += data[i];
        }

         for (j= (comma+1); j<data.length; j++) {
          part2 += data[j];
        }
       
        userOption = part1;
        randomChoice = part2;

        // console.log("randomChoice # 2 = " + randomChoice);
        // console.log("userOption # 2 = " + userOption);

        if (randomChoice == 'my-tweets') {
          tweetThis();
        } 

        if (userOption == 'spotify-this-song') {
          spotifyThis();
        }

        else if (userOption == 'movie-this') {
          movieThis();
        }
    });
  };
};

randomThis();

function movieThis() {

  if (userOption === 'movie-this' && userChoice != null){

    userChoice = process.argv.slice(3).join("+");

  // Request to the OMDB API with the movie specified 
    var queryUrl = 'http://www.omdbapi.com/?t=' + userChoice +'&y=&plot=short&tomatoes=true&r=json';

    // console.log(queryUrl);

  // Request to the queryUrl
        
    if (userOption === 'movie-this' && userChoice == '') {
    userChoice = 'Mr Nobody';
      var queryUrl = 'http://www.omdbapi.com/?t=' + userChoice +'&y=&plot=short&tomatoes=true&r=json';
    }

     if (userOption === 'movie-this' && randomChoice != null) {
      userChoice = ("'" + randomChoice + "'");
      var queryUrl = 'http://www.omdbapi.com/?t=' + userChoice +'&y=&plot=short&tomatoes=true&r=json';
    }

      request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }

        console.log("Title: " + JSON.parse(body)["Title"]);
        console.log("Year: " + JSON.parse(body)["Year"]);
        console.log("IMDb Rating: " + JSON.parse(body)["imdbRating"]);
        console.log("Country: " + JSON.parse(body)["Country"]);
        console.log("Language: " + JSON.parse(body)["Language"]);
        console.log("Plot: " + JSON.parse(body)["Plot"]);
        console.log("Actors: " + JSON.parse(body)["Actors"]);
        console.log("Rotten Tomato Rating: " + JSON.parse(body)["tomatoRating"]);
        console.log("Rotten Tomato URL: " + JSON.parse(body)["tomatoURL"]);
      

        var addMovie = ("Title: " + JSON.parse(body)["Title"]+ "\n" + "Year: "
        + JSON.parse(body)["Year"]+ "\n"
        + "IMDb Rating: " + JSON.parse(body)["imdbRating"] 
        + "\n" + "Country: " + JSON.parse(body)["Country"]+ "\n"
        + "Language: " + JSON.parse(body)["Language"]+ "\n"
        + "Plot: " + JSON.parse(body)["Plot"]+ "\n"
        + "Actors: " + JSON.parse(body)["Actors"]+ "\n" 
        + "Rotten Tomato Rating: " + JSON.parse(body)["tomatoRating"]+ "\n"
        + "Rotten Tomato URL: " + JSON.parse(body)["tomatoURL"]+ "\n");
        
          fs.appendFile('log.txt', addMovie, function (err) {

          });
      });  
    };
  };

movieThis();

function spotifyThis() {

  if (userOption === 'spotify-this-song' && userChoice !== null) {

    if (userOption === 'spotify-this-song' && userChoice == '') {
        userChoice = 'The Sign';
    }

    if (userOption === 'spotify-this-song' && randomChoice != null) {
    userChoice = ("'" + randomChoice + "'");
    }
  
    spotifyApi.searchTracks('"' + userChoice + '"')
      .then(function(data) {

        var songInfo = data.body.tracks.items[0];
          
        console.log("Artist Name: " + songInfo.artists[0].name)
        console.log("Song Title: " + songInfo.name)
        console.log("Link to url: " + songInfo.preview_url)
        console.log("Album: " + songInfo.album.name)

        var addSong = ("Artist Name: " + songInfo.artists[0].name + "\n"
        + "Song Title: " + songInfo.name + "\n"
        + "Link to url: " + songInfo.preview_url + "\n"
        + "Album: " + songInfo.album.name + "\n");

          fs.appendFile('log.txt', addSong, function (err) {
          });
                   
  // console.log("song result = " + songResult);
      }, 
        function(err) {
        console.error(err);
      });
  };
};
spotifyThis();

function tweetThis() {
    
  if (userOption === 'my-tweets' || randomChoice == 'my-tweets') {

    userT.get('statuses/user_timeline', {screen_name: 'elise_rothberg', 
      count: 20}, function(error, tweets, response) {
      
      if (!error) {

        for (var i=0; i<tweets.length; i++){
          var thisTweet = tweets[i];
                
          for (k=0; k<11; k++) {
            postDate += thisTweet.created_at[k];
          }
          
          for (m=26; m<30; m++) {
            year += thisTweet.created_at[m];
          }
           
          console.log("Tweet: " + tweets[i].text);
          console.log("Posted: " + postDate + year);
              
          var addTweets = ("Tweet: " + tweets[i].text + "\n"
          + "Posted: " + postDate + year + "\n");
            
            fs.appendFile('log.txt', addTweets, function (err) {
            });

          postDate = [];
          year = [];
        };
      }
    });
  }
};

tweetThis();

var addToFile = ("\n" + "Entered in console: " + process.argv.slice(2) + "\n" + "\n");
fs.appendFile('log.txt', addToFile, function (err) {
});