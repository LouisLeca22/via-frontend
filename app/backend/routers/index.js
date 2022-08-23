const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const auth = require('./auth');
const user = require('./user');
const activity = require('./activity');
const dashboard = require('./dashboard');
const controllerHandler = require('../helpers/controllerHandler');

router.use('/auth', auth);
router.use('/user', authJWT.protect, user);
router.use('/activity', authJWT.protect, activity);
router.use('/dashboard', authJWT.protect, dashboard);
router.use('/current', controllerHandler(authJWT.protect), (req, res) => {
  res.json(req.user);
});

module.exports = router;
