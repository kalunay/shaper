const router = require('express-promise-router')();
const { apartments } = require('../controllers');

router.route('/list').get(apartments.getAll);
router.route('/object/:ProjectId').get(apartments.getObject);

module.exports = router;