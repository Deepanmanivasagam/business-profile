const express = require("express");
const { registerUser,
        loginUser,
        getUser,
        updateUser,
        deleteUser } = require("../controllers/authController");

        const protect = require("../middleware/authMiddleware")
        const upload = require('../middleware/upload');

const router = express.Router();

router.post("/register",upload.single("profilePicture"), registerUser);
router.post("/login", loginUser)
router.get("/user/:username",getUser);
router.put("/me/:id",protect,updateUser);
router.delete("/user/:id",protect,deleteUser)

module.exports = router;
