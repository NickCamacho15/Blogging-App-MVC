const { Post } = require('../models');

const postData = [
  {
    title: 'Johns Blog Post',
    content: 'This is the content of the blog post.',
    user_id: 1 
  },
  {
    title: 'Janes Blog Post',
    content: 'This is the content of the blog post.',
    user_id: 2 
  },
{ 
    title: 'Joes Blog Post',
    content: 'This is the content of the blog post.',
    user_id: 3
},
{         
    title: 'Jims Blog Post',
    content: 'This is the content of the blog post.',
    user_id: 4
},
];

const seedPosts = () => Post.bulkCreate(postData, {
  individualHooks: true,
});

module.exports = seedPosts;
