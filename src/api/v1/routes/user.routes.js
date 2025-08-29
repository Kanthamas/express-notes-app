import { Router } from 'express';
import { signUp, login, verifyToken, logout } from '../controllers/user.controller.js';

const router = Router()

// Signup a new user
router.post("/signup", signUp)

// Login 
router.post("/login", login)

// Verify token
router.get("/verify", verifyToken)

// Logout
router.post("/logout", logout)

export default router