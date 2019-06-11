var express = require('express');
var router = express.Router();
var sha256 = require('js-sha256').sha256;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('File server');
});

router.post('/uploads', function(req, res, next) {
  let uploadedFile = req.files.file;

  uploadedFile.mv(`${__dirname}/../public/uploads/${uploadedFile.name}`, (err) => {
    if (err) {
      return res.status(422).send(err);
    }

    const digest = sha256(uploadedFile.data)
    res.json({file: `uploads/${uploadedFile.name}`, digest: digest});
  });
});

module.exports = router;
