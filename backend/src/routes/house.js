const router = require('express-promise-router')()
const { house } = require('../controllers')

router.route('/').post(house.create)
router.route('/update/:id/:house_id').post(house.update)
router.route('/upload/image').post(house.upload)
router.route('/createshape').post(house.createshape)
router.route('/:id/:house_id').get(house.getHouse)

module.exports = router