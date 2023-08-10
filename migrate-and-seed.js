const seedAll = require('./seeds/seed'); 

seedAll().then(() => {
  sequelize.close();
});
