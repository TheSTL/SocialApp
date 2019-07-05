const router = require('express').Router();

const authHandler= require('../handlers/auth')

router.route('/login').post(authHandler.login)
router.route('/signup').post(authHandler.signup)


module.exports=router;