const express = require('express');
const router = express.Router();
const localRoute = require('./local');
const googleRoute = require('./google');

router.use('/local', localRoute);
router.use('/google', googleRoute);



module.exports = router;