const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller.js')
const Auth = require('../auth/auth')

router.use(Auth.authenticateToken)

router.route('').get(UserController.getUsers)
router.route('/:userId').get(UserController.getUserById)
router.route('/remove').post(UserController.removeAllUsers)

module.exports = router
