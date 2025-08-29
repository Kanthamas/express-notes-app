import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import chalk from "chalk";
import { connectMongoDB } from "./src/api/v1/config/databases/mongodb.js";
import userRoutes from "./src/api/v1/routes/user.routes.js";
import noteRoutes from "./src/api/v1/routes.js";
import { authUser } from "./src/api/v1/middlewares/authUser.js";
import { notFoundErrorHandler } from "./src/api/v1/errors/notFoundErrorHandler.js";
import { centralizedErrorHandler } from "./src/api/v1/errors/centalizedErrorHandler.js";

const PORT = process.env.PORT || 4000;

async function startServer() {
	const app = express();

	// Middlewares
	app.use(express.json());

	app.use(
		cors({
			origin: ["http://localhost:5173", "http://localhost:5174"],
		})
	);

	app.use(cookieParser());

	if (process.env.NODE_ENV !== "production") {
		app.use(morgan("dev"));
	} else {
		app.use(morgan("combined"));
	}

	// Routes
	app.use("/", userRoutes);
	app.use("/notes", authUser, noteRoutes);

	// Error Handlers
	app.use(notFoundErrorHandler);

	app.use(centralizedErrorHandler);

	// Server
	try {
		// Connect DB first
		await connectMongoDB();

		// Then start server
		app.listen(PORT, () => {
			console.log(
				chalk.bold.green(
					`▶ Notes App Server running on Port: ${PORT} \n▶ Mode: ${process.env.NODE_ENV} `
				)
			);
		});
	} catch (err) {
		console.error("❌ Failed to start server:", err.message);
		process.exit(1);
	}
}

startServer();
