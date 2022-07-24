const { Router } = require('express');
const router = Router();
const BASE = process.env.BASE_URL;
const {
  login_handler,
  signup_handler,
  logout_handler,
  get_user,
} = require('../controllers/UserAuth');

router.post(`${BASE}/login`, login_handler);
router.post(`${BASE}/signup`, signup_handler);
router.get(`${BASE}/logout`, logout_handler);
router.get(`${BASE}/user`, get_user);

module.exports = router;
