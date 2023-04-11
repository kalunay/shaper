const router = require('express-promise-router')()
const { object } = require('../controllers')

router.route('/').get(object.get)
router.route('/').post(object.create)
router.route('/:id').get(object.getInfo)
router.route('/update/:id').post(object.update)
router.route('/:id').delete(object.delete)
router.route('/upload/image').post(object.upload)
router.route('/createShape').post(object.createShape)

module.exports = router