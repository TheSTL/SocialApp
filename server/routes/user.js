const router= require('express').Router()

const userHandler= require('../handlers/user')
const {isAuthentication} = require('../middlewares/auth')

router.route('/')
 .get(userHandler.list)

 router.route('/photo/:id')
 .get(userHandler.photo,userHandler.defaultPhoto)

 router.route('/defaultphoto')
 .get(userHandler.defaultPhoto)


 router.route('/follow')
 .put( userHandler.addFollower,userHandler.addFollowing)

 router.route('/unfollow')
 .put( userHandler.removeFollower,userHandler.removeFollowing)

 router.route('/findpeople/:id')
 .get(isAuthentication, userHandler.findPeople)

 router.route('/:id')
 .get( userHandler.userDetail)
 .put( userHandler.update)
 .delete(isAuthentication, userHandler.remove)


module.exports=router;
