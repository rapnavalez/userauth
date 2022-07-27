const { Router } = require('express');
const router = Router();
const BASE = process.env.BASE_URL;
const {
  login_handler,
  signup_handler,
  logout_handler,
  get_user,
  verify_email,
  new_password_token,
  create_new_password,
  request_new_confirmation_email,
  request_password_reset_link,
} = require('../controllers/UserAuth');
//login
router.post(`${BASE}/login`, login_handler);
router.get(`${BASE}/user`, get_user);

//signup
router.post(`${BASE}/signup`, signup_handler);
router.post(`${BASE}/getnewtoken`, request_new_confirmation_email);
router.get(`${BASE}/verifyemail/:token`, verify_email);

//logout
router.get(`${BASE}/logout`, logout_handler);

//forgot password
router.post(`${BASE}/getpasswordresetlink`, request_password_reset_link);
router.get(`${BASE}/newpassword/:token`, new_password_token);
router.patch(`${BASE}/createnewpassword/:token`, create_new_password);

module.exports = router;
