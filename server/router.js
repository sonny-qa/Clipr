var paths = require('./config/paths.js');
var app = require('./server.js');

app.get('/auth/google', paths.googleAuth);

app.post('/user/post/storeclip', paths.storeClip);

app.post('/loadClipsByCategory', paths.loadClipsByCategory);

app.get('/loadAllClips', paths.loadAllClips);

app.post('/user/post/addNote', paths.addNote);

app.get('/user/get/loadNotes', paths.loadNotes);

app.get('/getSuggestions', paths.getSuggestions);