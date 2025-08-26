import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import { connectMongoDB } from "./src/api/v1/config/databases/mongodb.js";
import noteApiV1 from "./src/api/v1/routes.js";

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
	if (process.env.NODE_ENV !== "production") {
		app.use(morgan("dev"));
	} else {
		app.use(morgan("combined"));
	}

	// Routes
	app.use("/", noteApiV1);

	// Error Handlers
	app.use((req, res) => {
		res.status(404).json({
			error: true,
			status: 404,
			message: "Resource not found",
		});
	});

	app.use((err, req, res, next) => {
		const statusCode = err.status || 500;
		if (statusCode >= 500 && process.env.NODE_ENV !== "production") {
			console.error(err.stack);
		} else {
			console.error(err.message);
		}
		res.status(err.status || 500).json({
			error: true,
			status: statusCode,
			message: err.message || "Internal Server Error",
		});
	});

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