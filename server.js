//----------------------------------------------------------------------------//
//                               Imports & Constants                          //
//----------------------------------------------------------------------------//

//Importing express module
const express = require('express');

//Setting express to a constant
const app = express();

//Importing mongoose module
var mongoose = require('mongoose');

//Importing body-parser module.
var bodyParser = require('body-parser');

//Setting up constant values for connecting to the database.
const host = process.env.DATABASE_HOST || "route-store-db";
const port = process.env.DATABASE_PORT || 27017;
const database = process.env.DATABASE_NAME || "routedb";
const user = process.env.DATABASE_USER || 'nodejs';
const pass = process.env.DATABASE_PASS || 'nodejs';
const url = `mongodb://${user}:${pass}@${host}:${port}/${database}`;

//Connecting mongoose to MongoDB
mongoose.connect(url);

//Setting the schema to use mongoose.
var Schema = mongoose.Schema;

//----------------------------------------------------------------------------//
//                               Schema & Model Creation                      //
//----------------------------------------------------------------------------//

//Creating a driverSchema.
var routeSchema = new Schema({

    driverId: String,
    routeId: String,
    facilityId: String,
    googleMapsLink: String,
    bounty: Number

})

//Create a model that uses the schema.
var route = mongoose.model('route', routeSchema);

//Make this available to Node app users.
module.exports = route;

//----------------------------------------------------------------------------//
//                               Function Calls                               //
//----------------------------------------------------------------------------//

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------------------------------//

app.get('/', function (req, res) {

  res.send("Hello, World!");

});

//----------------------------------------------------------------------------//

app.get('/routes', function (req, res) {

  route.find({driverId: -1}, function (err, docs) {

    if(!err){

        res.send(docs);

        console.log("Online routes found.");

    }
    else {

        res.send(err);

        console.log("Error, no routes found!");

    }

  });

});

//----------------------------------------------------------------------------//

app.post('/routes', function(req, res){

  route.findOneAndUpdate({routeId: req.body.routeId}, req.body , {upsert:true}, function(err, doc) {

    //Writing out the post information to console.
    if (!err) {

      res.send(doc);

      console.log('POST -> routeId: ' + req.body.routeId + ', bounty: ' + req.body.bounty);

    }
    else {

      res.send(err);

      console.error("Error, no drivers updated!")

    }

  });

});

//----------------------------------------------------------------------------//

app.delete('/routes/:id', function(req, res){

    var id = req.params['id'];

    route.find({routeId: id}, function (err, doc){

        if(!err){

            res.send(doc);

            console.log('Success! Route deleted!');

        }
        else{

            res.send(err);

            console.error("Error, no routes deleted!")

        }

    });

});


//----------------------------------------------------------------------------//

app.get('/routes/:id', function(req, res){

    var id = req.params['id'];

    route.find({routeId: id}, function (err, doc){

        if(!err){

            res.send(doc);

            console.log('Success! Route was found!');

        }
        else{

            res.send(err);

            console.error("Error, no routes found!")

        }

    });

});

//----------------------------------------------------------------------------//

app.listen(8080, function() {

  console.log('Listening on port 8080!')

});
