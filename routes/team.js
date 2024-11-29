const express = require('express');
const router = express.Router();

router.get('/team', (req, res) => {
  res.render('team', { title: 'Team Overview' });
});

module.exports = router;
