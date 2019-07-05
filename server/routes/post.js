const router = require('express').Router();

const postHandler= require('../handlers/post')
const {isAuthentication} = require('../middlewares/auth')

router.route('/:postId').get(postHandler.postDetails)

router.route('/new/:userId').post(isAuthentication ,postHandler.create)

router.route('/photo/:postId').get(postHandler.photo)

router.route('/by/:userId').get(isAuthentication ,postHandler.listByUser)

router.route('/feed/:userId')
  .get( postHandler.listNewsFeed)

router.route('/like')
.put(isAuthentication, postHandler.like)

router.route('/unlike')
.put(isAuthentication, postHandler.unlike)

router.route('/comment')
.put(isAuthentication, postHandler.comment);

router.route('/uncomment')
.put(isAuthentication, postHandler.uncomment)

router.route('/:postId')
.delete(isAuthentication, postHandler.remove)



module.exports=router;