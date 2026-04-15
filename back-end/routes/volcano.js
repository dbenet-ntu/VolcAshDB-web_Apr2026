const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');

const {
    get, 
    getTectonicSetting,
    getVolcStd,
    getVolcNum,
    add,
    update,
    remove
} = require('../controllers/volcanoController');

// Public Volcano routes

/**
 * @route POST /get
 * @description Fetches volcano data (specific details should be defined in the controller)
 * @access Public
 */
router.post('/get', get);

/**
 * @route POST /getTectonicSetting
 * @description Fetches volcano corresponding to a specific Tectonic Setting
 * @access Public
 */
router.post("/getTectonicSetting", getTectonicSetting);

/**
 * @route POST /getVolcStd
 * @description Fetches volcano standards or details (specific details should be defined in the controller)
 * @access Public
 */
router.post('/getVolcStd', getVolcStd);

/**
 * @route GET /getVolcNum
 * @description Fetches volcano numbers or identifiers (specific details should be defined in the controller)
 * @access Public
 */
router.get('/getVolcNum', getVolcNum);

// Apply authentication middleware to all routes after this point
router.use(requireAuth);

/**
 * @route POST /add
 * @description Adds a new volcano record (specific details should be defined in the controller)
 * @access Protected
 */
router.post('/add', add);

/**
 * @route POST /update
 * @description Updates an existing volcano record (specific details should be defined in the controller)
 * @access Protected
 */
router.post('/update', update);

/**
 * @route DELETE /:id
 * @description Removes a volcano record by its ID (specific details should be defined in the controller)
 * @access Protected
 */
router.delete('/:id', remove);

module.exports = router;