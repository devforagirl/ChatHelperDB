const Apple = require('../models/Apple');

const getApples = (req, res) => {
  Apple.findOne({}, (err, apple) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (!apple) {
      apple = new Apple({ count: 0 });
    }

    res.send({ count: apple.count });
  });
};

module.exports = {
  getApples,
};
