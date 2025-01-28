const express = require("express");
const { registerUser,
        loginUser,
        getUser,
        updateUser,
        deleteUser } = require("../controllers/authController");

        const protect = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:username",getUser);
router.put("/me/:id",protect,updateUser);
router.delete("/user/:id",protect,deleteUser)

module.exports = router;
