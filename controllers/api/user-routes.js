const router = require('express').Router();
const { User } = require('../../models');

// Create a new user
router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      // Redirect to the homepage
      res.redirect('/home');
    });
  } catch (err) {
    res.status(400).json(err);
  }
});


// Login a user
// Login a user
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });
    if (!userData) {
      res.status(400).json({ message: 'No user with that username!' });
      return;
    }
    const validPassword = userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      // Redirect to the homepage or dashboard or wherever you want the user to go
      res.redirect('/home');
    });
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
