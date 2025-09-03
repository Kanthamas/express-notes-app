import { beforeAll, afterAll, afterEach } from "vitest";
import { startMongoServer, stopMongoServer } from "./mongoMemoryServer.js";
import mongoose from "mongoose";

beforeAll(async () => {
	process.env.JWT_SECRET = "testsecret";
	await startMongoServer();
});

afterEach(async () => {
	// Clean up collections after each test
	const collections = await mongoose.connection.db.collections();
	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await stopMongoServer();
});
