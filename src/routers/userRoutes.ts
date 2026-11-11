import express from "express";
import { auth } from "../middleware/auth.ts";
import { UserController } from "../controllers/userController";
const router = express.Router();

// sign up
// POST create new user

router.post("/register", UserController.createUser);

// login
// POST login user creates new token

router.post("/login", UserController.loginUser);

// logout
// POST logout user

router.post("/logout", auth, UserController.logoutUser);

// Get user

router.get("/me", auth, UserController.getUser);

// Get users
// only commander and System Admin can use it
// TODO: commander middleware
// GET /api/users/search?q=yael

router.get("/search", auth, UserController.searchUsers);

// GET user by ID

router.get("/:userId", auth, UserController.getUserById);

// UPDATE user password

router.patch("/password", auth, UserController.updateUserPassword);

// UPDATE user details by id
// עצמי לשדות מוגבלים / מפקד

router.patch("/:userId", auth, UserController.updateUser);

// making user a commander
// PUT
// must be System Admin

router.put("/:userId/roles", auth, UserController.createCommander);

export default router;
