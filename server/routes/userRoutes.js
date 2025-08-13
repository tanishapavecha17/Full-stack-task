const express = require("express");
const router = express.Router();

// Controllers
const {setPassword, resetpassword} = require("../controllers/users/setPasswordController");
const { validatesignup, validateSetPassword, validateLogin } = require("../validation/validations");
const loginUser = require("../controllers/users/loginUserController");
const SignUserController = require("../controllers/users/SignupUserController");
const { getById, editUserByIdControllers, getAllUsersControllers, deleteUserByIdController, getByRoleController } = require("../controllers/users/adminControlls");
const { getMyProfile, updateMyProfile, deleteProfileImage, updateProfileImageController } = require("../controllers/users/usercontrolls");

// Middlewares
const validateToken = require("../middlewares/validatetoken");
const validateAdmin = require("../middlewares/validatetokenadmin");
const { uploadProfileImageMiddleware } = require("../middlewares/uploadImageMiddleware");

// ------ PUBLIC ROUTES ----------
router.post('/signup', validatesignup, SignUserController);
router.post('/login', validateLogin, loginUser);

// Password set reset routes
router.post("/set-password/:token", validateSetPassword, setPassword);
router.get("/api/set-password/:token", (req, res) => {
    res.render("setPassword", { token: req.params.token });
});
router.post("/resetpassword/:token", validateSetPassword, resetpassword);


// User profile routes
router.get('/me', validateToken, getMyProfile);
router.put('/me/edit', validateToken, updateMyProfile);
router.put('/me/profile-image', validateToken, uploadProfileImageMiddleware,updateProfileImageController);
router.delete('/me/profile-image', validateToken, deleteProfileImage);

// --------- ADMIN ROUTES ---------------
router.get('/admin/all-users', validateToken, validateAdmin, getAllUsersControllers);
router.get('/admin/users/:id', validateToken, validateAdmin, getById);
router.get('/admin/users/role/:role', validateToken, validateAdmin, getByRoleController);
router.put('/admin/users/edit/:id', validateToken, validateAdmin, editUserByIdControllers);
router.delete('/admin/delete-user/:id', validateToken, validateAdmin, deleteUserByIdController);

// Admin demo 
router.get("/admin/user", validateToken, validateAdmin, (req, res) => {
    try {
        res.status(200).json({ msg: "success" });
    } catch (err) {
        res.status(400).json({ msg: "fail" });
    }
});

module.exports = router;