
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express= require('express')
const bodyParser = require('body-parser');
const uuid = require('uuid'); 
var cors = require('cors')
var app = express();
app.use(cors());

app.set('view engine', 'html');
app.get('/', function(req, res) {
    res.sendfile('dist/eftMgmt/index.html', {root: __dirname })
});

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/getallcitizens', (req, res) => {
  // console.log(uuid.v1());
  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('first-database');
    db.collection('citizens1').find().toArray(function(err,cols){
      // console.log("colls");
      // console.log(cols);
      res.send({"status":200,"data":cols});
    });
  });
});


// To mark visited by MOs
app.post('/visitedbyMO', (req, res) => {
  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('raisedrequests');
    db.collection('raisedrequests').insertOne(req.body.newReq, function (err, result) {
      assert.equal(err, null);
      console.log("Inserted a document into the families collection.");
      res.send({"status":200,"msg":"Request raised successfully "})
    });
  });
});


app.get('/allmos', (req, res) => {
  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('MOs');
    db.collection('MOs').find().toArray(function(err,cols){
      res.send({"status":200,"data":cols});
    });
  });
});

// To get raised requests 
app.get('/raisedrequests', (req, res) => {
  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('raisedrequests');
    db.collection('raisedrequests').find().toArray(function(err,cols){
      res.send({"status":200,"data":cols});
    });
  });
});

// To raise request for someone 
app.post('/raisedrequests', (req, res) => {
let restofObj = {
  
    "nationality": "Indian",
    "knownDiseases": "Asthama",
    "visitedPlaces": "New York,Mumbai",
    "qurantineDay": 3,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  
}
  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('raisedrequests');

    db.collection('raisedrequests').insertOne({...req.body.data,...restofObj}, function (err, result) {
      assert.equal(err, null);
      console.log("Inserted a document into the families collection.");
      res.send({"status":200,"msg":"Request raised successfully "})
    });
  });
});


// State notifies MO neaby
app.post('/notifymo',(req,res)=>{
  console.log(req.body);

  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('first-database');
    db.collection('citizens1').updateOne({"id":req.body.id}, { $set: {"visitedMO" : true}},function(err,result){
      // console.log(res);
      res.send({"status":200,"msg":"record updated successfully !"})
    });
  });
});

// If person raises alert
app.post('/raisedalert',(req,res)=>{
  console.log(req.body);

  MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
    var db = client.db('first-database');
    db.collection('citizens1').updateOne({"id":req.body.id}, { $set: {"raisedAlarm" : true,"symptomsCough":req.body.symptomsCough,
    "symptomsBreathing":req.body.symptomsBreathing,
    "symptomsFever":req.body.symptomsFever,
    "symptomsTiredness":req.body.symptomsTiredness}},function(err,result){
      // console.log(res);
      res.send({"status":200,"msg":"record updated successfully !"})
    });

  });

});

app.listen(4000,()=>{
console.log("Chalu zala");
});


var insertDocument = function (db, callback) {
  var docs = [{
    "firstName": "Test1",
    "lastName": "Last1",
    "age": 23,
    "gender": "male",
    "nationality": "Indian",
    "knownDiseases": "Asthama",
    "visitedPlaces": "New York,Mumbai",
    "qurantineDay": 3,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411014",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test2",
    "lastName": "Last2",
    "age": 28,
    "gender": "female",
    "nationality": "Indian",
    "knownDiseases": "",
    "visitedPlaces": "Family gathering in Kharadi,Pune",
    "qurantineDay": 5,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test3",
    "lastName": "Last3",
    "age": 44,
    "gender": "female",
    "nationality": "Indian",
    "knownDiseases": "Diabetes",
    "visitedPlaces": "",
    "qurantineDay": 2,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test4",
    "lastName": "Last4",
    "age": 35,
    "gender": "male",
    "nationality": "Indian",
    "knownDiseases": "High blood pressure",
    "visitedPlaces": "Mumbai Airport",
    "qurantineDay": 1,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test5",
    "lastName": "Last5",
    "age": 55,
    "gender": "female",
    "nationality": "Indian",
    "knownDiseases": "arthritis",
    "visitedPlaces": "",
    "qurantineDay": 9,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test6",
    "lastName": "Last6",
    "age": 50,
    "gender": "male",
    "nationality": "Indian",
    "knownDiseases": "",
    "visitedPlaces": "London",
    "qurantineDay": 1,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test7",
    "lastName": "Last7",
    "age": 41,
    "gender": "male",
    "nationality": "Indian",
    "knownDiseases": "",
    "visitedPlaces": "",
    "qurantineDay": 2,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test8",
    "lastName": "Last8",
    "age": 18,
    "gender": "male",
    "nationality": "British",
    "knownDiseases": "",
    "visitedPlaces": "Pune University",
    "qurantineDay": 7,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test9",
    "lastName": "Last9",
    "age": 28,
    "gender": "female",
    "nationality": "Indian",
    "knownDiseases": "",
    "visitedPlaces": "",
    "qurantineDay": 2,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  },
  {
    "firstName": "Test10",
    "lastName": "Last10",
    "age": 30,
    "gender": "female",
    "nationality": "Indian",
    "knownDiseases": "",
    "visitedPlaces": "",
    "qurantineDay": 6,
    "symptomsCough": false,
    "symptomsBreathing": false,
    "symptomsFever": false,
    "symptomsTiredness": false,
    "areapincode": "411011",
    "goneOutsideRadius": false,
    "visitsbyMO": 0,
    "raisedAlarm": false,
    "visitedMO": false,
    "photoMissing": false,
    "appActivated": false,
    "contactNo":"12121245",
    "moVisitDone":false,
    "temperature":"",
    "GPSoff": false
  }];

  for (var i = 0; i < docs.length; i++) {
    db.collection('citizens1').insertOne({"id":uuid.v1(),...docs[i]}, function (err, result) {
      assert.equal(err, null);
      console.log("Inserted a document into the families collection.");
      callback();
    });
  }
};

//    MongoClient.connect("mongodb://first-database:zJ78SEQu2WPtcltFpIPXPctqenUqQMaO4GjAwuRcwyhs2onjsWz69VHns8mP918ta6TvcEGkhScDPyRqPDrdPA%3D%3D@first-database.mongo.cosmos.azure.com:10255/?ssl=true&appName=@first-database@", function (err, client) {
//    var db = client.db('first-database');
//    insertDocument(db, function() {
//      console.log("Insert document callback");
//      client.close();
//    });
//  });
