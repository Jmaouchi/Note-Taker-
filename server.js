const express = require('express');
const fs = require('fs');
// get the data from the db.json file
const data  = require('./dataFile/db.json');
// setup path to use it while pathing files 
const path = require('path');
// const uuid = require("uuid");
// const uuid = require('uuid')

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


// start the server. i also have nodemone package installed, to restart the server automatically with typing npm run dev
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
