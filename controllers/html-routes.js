const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/home', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User }],
    });

    const posts = postData.map((post) => {
      const plainPost = post.get({ plain: true });
      plainPost.date_created = new Date(plainPost.date_created).toLocaleDateString();
      return plainPost;
    });

    res.render('home', {
      posts,
      logged_in: req.session.logged_in,
      isHome: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/home');
  } else {
    res.render('landing', { title: 'Welcome', isLandingPage: true });
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/home');
    return;
  }
  res.render('login', { title: 'Login' });
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/home');
    return;
  }
  res.render('signup', { title: 'Signup' });
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: {
        model: User,
        attributes: ['username'],
      },
    });
    
    const posts = postData.map((post) => {
      const plainPost = post.get({ plain: true });
      plainPost.date_created = new Date(plainPost.date_created).toLocaleDateString();
      return plainPost;
    });
    

    res.render('dashboard', {
      title: 'Dashboard',
      posts,
      logged_in: req.session.logged_in,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    const post = postData.get({ plain: true });
    post.date_created = new Date(post.date_created).toLocaleDateString();
    post.comments.forEach((comment) => {
      comment.date_created = new Date(comment.date_created).toLocaleDateString();
    });

    res.render('single-post', {
      title: post.title,
      post: post,
      comments: post.comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect('/'); // Redirect to homepage or login page
    });
  } else {
    res.redirect('/'); // Redirect to homepage or login page
  }
});


router.get('/post/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    const post = postData.get({ plain: true });
    res.render('edit-post', { post, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
