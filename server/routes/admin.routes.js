const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser, getStats } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;