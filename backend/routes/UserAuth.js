const { Router } = require('express');
const router = Router();
const BASE = process.env.BASE_URL;
const {
  login_handler,
  signup_handler,
  logout_handler,
  get_user,
  verify_email,
  get_token,
} = require('../controllers/UserAuth');

router.post(`${BASE}/login`, login_handler);
router.post(`${BASE}/signup`, signup_handler);
router.get(`${BASE}/logout`, logout_handler);
router.post(`${BASE}/user`, get_user);
router.get(`${BASE}/verifyemail/:token`, verify_email);
router.get(`${BASE}/token/:token`, get_token);

module.exports = router;
