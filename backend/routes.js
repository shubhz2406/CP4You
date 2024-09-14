const authController = require('./controllers/auth-controller');
const connectController = require('./controllers/connect-controller');
const groupController = require('./controllers/group-controller');
const problemController = require('./controllers/problem-controller');
const authMiddlewares = require('./middlewares/authMiddlewares')
const router = require('express').Router();

// authentication routes
router.post('/api/send-otp-email',authController.sendOtpEmail);
router.post('/api/verify-otp',authController.verifyOtp);
router.get('/api/refresh',authController.refresh); // to refresh the access token and refresh token
router.post('/api/login-email',authController.loginEmail);
router.post('/api/google-login', authController.googleLogin);
router.post('/api/logout',authController.logout);

// cf connect route
router.post('/api/connect-codeforces',connectController.verifyHandle);

// cf handle remove route
router.post('/api/remove-codeforces',connectController.removeHandle);

// group routes
router.post('/group/add',groupController.addGroup);
router.delete('/group/:groupId', groupController.deleteGroup);
router.patch('/group/:groupId', groupController.updateGroup);
// router.get('/group/:userId',groupController.getGroups);

// problem routes
router.get('/problem/:contestId/:index',problemController.getProblem);
router.post('/problem/add/:contestId/:index',problemController.addProblem);
router.patch('/problem/approach/:contestId/:index',problemController.addApproach);
router.patch('/problem/approach/:contestId/:index',problemController.editApproach);

// cf user data api routes
// router.get('api/user/:handle',cfApiController.getUserInfo);
// router.get('api/user-status/:handle',cfApiController.getUserSubmissions);

module.exports = router;