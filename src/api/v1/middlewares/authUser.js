import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
	try {
		// Validate valid token from cookies
		const token = req.cookies?.accessToken;

		if (!token) {
			const err = new Error("Access denied. No token!");
			err.status = 401;
			return next(err);
		}

		// Verify token
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		req.user = { _id: decodedToken.userId };

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			const err = new Error("Token has expired, please login again.");
			err.status = 401;
			return next(err);
		}

		if (error.name === "JsonWebTokenError") {
			const err = new Error("Invalid token.");
			err.status = 401;
			return next(err);
		}

		next(error);
	}
};
