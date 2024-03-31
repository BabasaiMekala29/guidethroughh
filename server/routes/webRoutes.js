const {Router} = require('express');
const routeController = require('../controllers/routeControllers')
const router = Router();

router.post('/signup', routeController.signup_post);
router.post('/login', routeController.login_post);
router.post('/logout', routeController.logout_get);
router.get('/profile',routeController.profile_get);
router.post('/getotp',routeController.get_otp);
router.post('/verifyotp',routeController.verifyotp);
router.post('/post',routeController.create_post);
router.get('/category/:head/:subhead', routeController.get_posts);
router.get('/user/:id',routeController.get_userposts);
router.get('/post/:id',routeController.delete_post);
router.put('/edit/post/:id',routeController.edit_post);
router.put('/post/:postid/upvote',routeController.put_upvote);
router.put('/post/:postid/downvote',routeController.put_downvote);
router.put('/post/:postid/like',routeController.put_like);
router.put('/post/:postid/save',routeController.save_post);
router.get('/savedposts/:id',routeController.get_savedposts);
router.put('/unsavepost/:postid',routeController.unsavepost);
router.get('/category/:head/:subhead/sortby/:sec',routeController.get_sortedposts);
router.put('/post/:postid/comment',routeController.put_comments);
router.get('/post/:postid/comment',routeController.get_comments);
router.get('/getpost/:id',routeController.get_fullPost);
router.get('/post/:id/interactions/:username',routeController.get_interactions);
router.get('/post/:pid/comment/:cid/cominteractions/:uname',routeController.get_cominteractions);
router.put('/post/:pid/comment/:cid/upvote',routeController.put_comupvote);
router.put('/post/:pid/comment/:cid/downvote',routeController.put_comdownvote);
router.put('/post/:id/notify',routeController.put_notification);
router.get('/user/:userid/notifications',routeController.get_notifications);
router.get('/search/:searchValue',routeController.get_searchresults);
router.get('/user/:userid/notifications_count',routeController.get_notificationcount);
router.put('/notifications/:nid',routeController.make_viewed);
router.get('/checkpost/:id',routeController.check_post);
router.get('/user/:uid/tipNotification',routeController.get_tipnotification)
module.exports = router;
