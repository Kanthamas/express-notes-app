import chalk from "chalk";
import app from "./app.js";
import { connectMongoDB } from "./src/api/v1/config/databases/mongodb.js";

const PORT = process.env.PORT || 4000;

async function startServer() {
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
