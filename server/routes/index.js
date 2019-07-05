const router = require('express').Router();


router.use('/auth',require('./auth'))
router.use('/api/posts',require('./post'))
router.use('/api/users',require('./user'))


module.exports=router;