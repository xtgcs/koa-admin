const userController = require('../controller/userController')

const router = require('koa-router')()

// router.prefix('/users')


router.get('/user/info', userController.getUserInfo);

router.post('/user/login', userController.postUserAuth);

router.post('/user/registe', userController.setUserAuth);

router.post('/user/logout', userController.logout);

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
