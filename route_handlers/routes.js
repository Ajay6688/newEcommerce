const router = require('express').Router();
// const { checktoken } = require('../authorization/token_validation');
const { customerSignup, agentSignup, sellerSignup, signin, getdata, forgotPassword, checkOtp, resetPassword } = require('../controllers/controller');

router.get('/', (req, res) => {
    return res.send("hello");
});

// signup APIs
router.post('/customer_signup', customerSignup);
router.post('/agent_signup', agentSignup);
router.post('/seller_signup', sellerSignup);
// login APIs
router.post('/signin', signin);
//forgot password api sending otp on users phone no. and registering the otp in tb_users table 
router.patch('/forgot-password', forgotPassword);
// otp checking api 
router.post('/check-otp', checkOtp);
//  reset password
router.patch('/reset-password', resetPassword)

//get whole data just for testing 
router.get('/get-data', getdata)

module.exports = {
    router
}