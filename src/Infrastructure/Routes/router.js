const petRoutes = require('./pet.routes');
const tutorRoutes = require('./tutor.routes');
const router      = require('express').Router();

router.use('/', tutorRoutes)
router.use('/', petRoutes)

module.exports = router