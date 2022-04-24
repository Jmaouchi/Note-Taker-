const express = require('express');
const fs = require('fs');
// get the data from the db.json file
const data  = require('./dataFile/db.json');
// setup path to use it while pathing files 
const path = require('path');
// const uuid = require("uuid");
const uuid = require('uuid')

// const crypto = require('crypto');
const {findById, validateInput } = require('./notes');
  console.log({findById});
// const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");

const app = express();
// set a port number for the server 
const PORT = process.env.PORT || 3000;

// Middleware. parse incoming string or array data (it will parse any data that is coming from the outside of the server)
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json())// The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object

//The way the express.static works is that we provide a file path to a location in our application (in this case, 
//the public folder) and instruct the server to make these files static resources.e so like html can use style.css 
//realated to it and javascript related to it 
app.use(express.static('public'));
// this is to start listening to the server 

// Routes for HTML
app.get('/notes', (req,res) => {
  res.sendFile(path.join(__dirname,"/public/notes.html"))
})

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
})

// get data as json formating, from the http://localhost:3000/api/notes  route
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/dataFile/db.json"))
});



// get an elemenet from the json file based by its ID, while visiting the http://localhost:3000/api/note/idNumber
// i added this even tho its not needed and also the UUID is not a single number.
app.get('/api/note/:id', (req, res) => { //get is a route of the app method 
  // the req.params = url/params or it will add that param to the end of the url
  const result = findById(req.params.id, data);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});


// post data to the json file 
app.post('/api/notes', (req, res) => {

  // validating the input 
  if (!validateInput(req.body)){
    res.status(400).send('The notes are not properly formatted.'); // this status send is for the client to tell them what happen and whats missing
    // everthing that is 400 range means that its the user error and not the server
  }else{
    // Since we are getting data from the user as regular text, get the data from the json file then parse it to be able to add that user data
    // to the json file, if not it wont work, due to data from my json file is formated as json 
    const notesFromDB = JSON.parse(fs.readFileSync('./dataFile/db.json'));
    // set an id based on what the next index of the array will be
    // i also got the uuid package to create an id for every object in my data array, but i used this method since i added an API
    // to get a single object with its own id (since uuid is a big number. both are working but uuid is more secure)
    // req.body.id = notesFromDB.length.toString();
   
    // UUID will add an unique ID to every sigle element in our file, to prevent mix infos 

    // Set the data that we are getting form the user in a variable called newNote
    const newNote = req.body;
    newNote.id = uuid.v1();  // this is if want to use the uuid methode 
  
    // push the user input into our existing data
    notesFromDB.push(newNote)

    // reWrite the json file including the user input (need to transfer the data to a string)
    fs.writeFileSync("./dataFile/db.json", JSON.stringify(notesFromDB))

    //then send the data that is inside the jsonFile to the user 
    // ( or to the frontEnd peoples to display it ) 
    res.json(notesFromDB); 
  }
})


//delete notes from db
app.delete("/api/notes/:id", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./dataFile/db.json"));
  // filter the data that is in the json file, and check the id if its matching to the user request id, if so delete it from the file 
  const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
  fs.writeFileSync("./dataFile/db.json", JSON.stringify(delNote));
  res.json(delNote);
})


// start the server. i also have nodemone package installed, to restart the server automatically with typing npm run dev
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
