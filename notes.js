// findById function 
function findById(id, notesArray) {
  // this will filter thru the notes data and search for a specific notes id and return the result using the notes id 
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

// validate input function, to chack if the user added his inputs correctly
function validateInput (note) {
    //if the notes title is empty or its not inside of a string then return a false 
    if (!note.title || typeof note.title !== 'string') {
      return false;
    }
    //if the note text is empty or its not inside of a string then return a false 
    if (!note.text || typeof note.text !== 'string') {
      return false;
    }
    return true;
  }
  


module.exports = {findById, validateInput}