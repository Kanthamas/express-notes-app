import mongoose from "mongoose";
import chalk from "chalk";

const URI = process.env.MONGODB_URI;

export const connectMongoDB = async () => {
	if (!URI) throw new Error("❌ Missing MongoDB URI in env");

	try {
		await mongoose.connect(URI);
		console.log(chalk.bgGreen(`💾 MongoDB Connected `));
	} catch (error) {
		console.error(
			chalk.bgRedBright("❌ Initial MongoDB connection failed\n", error.message)
		);
		process.exit(1);
	}

	const db = mongoose.connection;

	db.on("error", (err) => {
		console.error(chalk.bgRed("⚠️ Mongoose connection error:", err.message));
	});

	db.on("disconnected", () => {
		console.warn(chalk.yellow("🔌 Mongoose disconnected "));
	});
};
