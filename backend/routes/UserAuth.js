const { Router } = require('express');
const router = Router();
const BASE = process.env.BASE_URL;
const { login, signup, logout, get_user } = require('../controllers/UserAuth');

router.post(`${BASE}/login`, login);
router.post(`${BASE}/signup`, signup);
router.get(`${BASE}/logout`, logout);
router.get(`${BASE}/user`, get_user);

module.exports = router;
