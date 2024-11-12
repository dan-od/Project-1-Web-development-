const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 4000;

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
