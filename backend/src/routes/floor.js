const router = require('express-promise-router')()
const { floor } = require('../controllers')

router.route('/').post(floor.create)
router.route('/update/:id/:house_id/:floor_id').post(floor.update)
router.route('/upload/image').post(floor.upload)
router.route('/createshape').post(floor.createshape)
router.route('/:id/:house_id/:floor_id').get(floor.getFloor)

module.exports = router