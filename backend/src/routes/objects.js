const router = require('express-promise-router')();
const { objects } = require('../controllers');

router.route('/list').get(objects.getAll);
router.route('/:id').get(objects.get);

module.exports = router;