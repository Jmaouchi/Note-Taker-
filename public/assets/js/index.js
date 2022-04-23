//select the note title from note.html (where the user can add a title for his note)
const $noteTitle = $(".note-title");
//select the note-textarea from note.html (where the user can add a text for his note)
const $noteText = $(".note-textarea");
// select the save-note from note.html ( where a user can click and save his note and text)
const $saveNoteBtn = $(".save-note");
// // select the new-note from note.html ( where a user can click and add a new note)
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// data is used to keep track of the note in the textarea
let data = {};

// A function for getting all notes from the db json file
// note that here we are using JQuery instead of vanila JS, and we are using ajax instead of fetch 
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// A function for saving a note to the db
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// A function for deleting a note from the db
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

//If there is data, display it, otherwise render empty inputs
const renderdata = () => { // this function is only to display the data and can't Edit it if the statement is true; also hide the saveBtn 
  $saveNoteBtn.hide();

  if (data.id) {
    $noteTitle.attr("readonly", true); // readonly attr set to true means that you can not edit the text after clicking a certain button 
    $noteText.attr("readonly", true);
    $noteTitle.val(data.title); // this will set the title to the input area
    $noteText.val(data.text);// this will set the title to the TextArea
  } else {
    $noteTitle.attr("readonly", false); // this will allow you to Edit your text inside of the input 
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function () {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  //This is to keep running the saveNote function.  post the data of the newNote to the api that is selected in the saveNote function 
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderdata();
  });
};

// Delete the clicked note
// After clicking teh delete button, call this function 
const handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  if (data.id === note.id) {
    data = {};
  }

  deleteNote(note.id).then(() => {
    //this getAndRenderNote is to get the data that was sent as json to that api endpoint and then display it on the DOM 
    getAndRenderNotes();
    // call render data to stop Editing the inputs
    renderdata();
  });
};

// Sets the data and displays it
const handleNoteView = function () {
  data = $(this).data();
  renderdata();
};

// Sets the data to and empty object and allows the user to enter a new note
const handleNewNoteView = function () {
  data = {};
  renderdata();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

  // Returns jquery object for li with given text and delete button
  // unless withDeleteButton argument is provided as false
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();