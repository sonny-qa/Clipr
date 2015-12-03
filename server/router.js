var paths = require('./config/paths.js');
var app = require('./server.js')

app.get('/auth/google', paths.googleAuth);
  // app.get('/auth/google', function(){
  //     console.log('in google auth')
  // })

// app.get('/auth/google/callback', passport.authenticate('google', {
//       failureRedirect: '/#/landing'
//     }),
//     function(req, res) {
//       console.log('req', req)
//       console.log('res', res)
//         //when they come back after a successful login, setup clipr cookie
//       res.cookie('clipr', req.session.passport.user.accessToken)
//         // Successful authentication, redirect home.
//       res.redirect('/#/clips');
//     }),


 app.post('/user/post/storeclip', paths.storeClip);
 //app.post('/user/post/storeclip', paths.createKeywords);


app.post('/loadClipsByCategory', paths.loadClipsByCategory);

app.get('/loadAllClips', paths.loadAllClips);

app.post('/user/post/addNote', paths.addNote);

app.get('/user/get/loadNotes', paths.loadNotes);