const router = require('express-promise-router')()
const { floors } = require('../controllers')

router.route('/').post(floors.create)
router.route('/update/:id/:house_id/:floor_id').post(floors.update)
router.route('/upload/image').post(floors.upload)
router.route('/createshape').post(floors.createshape)
router.route('/:id/:house_id/:floor_id').get(floors.getFloor)

module.exports = router