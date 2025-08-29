import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
	try {
		// Validate required fields
		const { fullName, email, password } = req.body;
		if (!fullName || !email || !password) {
			const err = new Error("All fieled are required for signup.");
			err.status = 400;
			return next(err);
		}

		// Validate existing user
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			const err = new Error("Email already in use!");
			err.status = 409;
			return next(err);
		}

		// Create a new user successfully
		const user = await User.create({ fullName, email, password });

		const newUser = { ...user._doc };
		delete newUser.password;

		res.status(201).json({
			error: false,
			message: "Create a new user successfully.",
			data: newUser,
		});
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		// Validate required fields
		const { email, password } = req.body;
		if (!email || !password) {
			const err = new Error("All fieled are required for login.");
			err.status = 400;
			return next(err);
		}

		// Validate user by email
		const user = await User.findOne({ email });
		if (!user) {
			const err = new Error("Invalid credentials!");
			err.status = 401;
			return next(err);
		}

		// Validate password
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			const err = new Error("Invalid credentials!");
			err.status = 401;
			return next(err);
		}

		// Generate Token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3h",
		});

		// Login successfully
		res.cookie("accessToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			path: "/",
			maxAge: 3 * 60 * 60 * 1000,
		});

		res.status(200).json({
			error: false,
			message: "Login successfully.",
			data: { _id: user._id, fullName: user.fullName, email: user.email },
		});
	} catch (error) {
		next(error);
	}
};

export const verifyToken = async (req, res, next) => {
	try {
		// Validate token
		const token = req.headers.authorization.split(" ")[1];

		if (!token) {
			const err = new Error("Token is required");
			err.status = 401;
			return next(err);
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		res.status(200).json({
			error: false,
			message: "Token is valid.",
			data: { userId: decoded.userId },
		});
	} catch (error) {
		next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
		});

		res
			.status(200)
			.json({ error: false, messsage: "Logout successfully.", data: null });
	} catch (error) {
		next(error);
	}
};
