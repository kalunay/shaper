const router = require('express-promise-router')()
const { object } = require('../controllers')

router.route('/').get(object.get)
router.route('/').post(object.create)
router.route('/:id').get(object.getInfo)
router.route('/:id').put(object.update)
router.route('/:id').delete(object.delete)
router.route('/upload').post(object.upload)

module.exports = router