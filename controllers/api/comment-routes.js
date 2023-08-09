const router = require('express').Router();
const { Comment } = require('../../models');
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment_text: req.body.comment_text, // Use comment_text from request body
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });
    // Find the associated user to include the username in the response
    const user = await User.findByPk(req.session.user_id);
    const commentWithUser = {
      ...newComment.get({ plain: true }),
      User: user.get({ plain: true })
    };

    res.status(200).json(commentWithUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: {
        model: User,
        attributes: ['username'],
      },
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post!' });
    }

    const commentsWithUser = comments.map((comment) => {
      return {
        ...comment.get({ plain: true }),
        User: comment.user.get({ plain: true })
      };
    });

    res.status(200).json(commentsWithUser);
  } catch (err) {
    console.error(err); // Log the error to the console
    res.status(500).json(err);
  }  
});



module.exports = router;
