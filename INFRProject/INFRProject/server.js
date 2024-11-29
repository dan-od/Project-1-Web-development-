const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 4000;
const session = require('express-session');
require('dotenv').config();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error', // Add a title for the error page
    message: err.message,
    error: err
  });
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using https
}));
