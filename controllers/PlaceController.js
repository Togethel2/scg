const Scg = require('./ScgController');
class Place extends Scg {
     constructor() {
          super();
     }

     async mapList(next) {
          var https = require('https');
          var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.8234866,100.5081204&radius=5000&type=restaurant&key='API_KEY'"

          https.get(url, function (response) {
               var body = '';
               response.on('data', function (chunk) {
                    body += chunk;
               });

               response.on('end', function () {
                    var places = JSON.parse(body);
                    var locations = places.results;
                    var randLoc = locations[Math.floor(Math.random() * locations.length)];
                    next(locations)
               });
          }).on('error', function (e) {
               console.log("Got error: " + e.message);
          });
     }
}

module.exports = Place;
