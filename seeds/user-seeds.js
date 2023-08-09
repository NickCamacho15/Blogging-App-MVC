const { User } = require('../models');

const userData = [
  {
    username: 'john_doe',
    password: 'password123'
  },
  {
    username: 'jane_doe',
    password: 'password456'
  },

    {
    username: 'jim_doe',
    password: 'password789'
    },
    {
    username: 'joe_doe',
    password: 'password101112'
    },
];

const seedUsers = () => User.bulkCreate(userData, {
  individualHooks: true,
});


module.exports = seedUsers;
