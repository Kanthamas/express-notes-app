import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../src/api/v1/models/user.model.js";
import { bcrypt } from "bcrypt";

describe("User Routes:  POST /signup", () => {
	it("should create a new user successfully", async () => {
		const res = await request(app).post("/signup").send({
			fullName: "Alice",
			email: "alice@example.com",
			password: "password123",
		});

		expect(res.status).toBe(201);
		expect(res.body.message).toBe("Create a new user successfully.");
		expect(res.body.data).toHaveProperty("email", "alice@example.com");

		// Check that the user exists in the database
		const userInDb = await User.findOne({ email: "alice@example.com" });
		expect(userInDb).not.toBeNull();
		expect(userInDb.fullName).toBe("Alice");
	});

	it("should fail if email already exists", async () => {
		// First, create a user manually
		await User.create({
			fullName: "Alice",
			email: "alice@example.com",
			password: "password123",
		});

		// Try signing up again with the same email
		const res = await request(app).post("/signup").send({
			fullName: "Alice",
			email: "alice@example.com",
			password: "password123",
		});

		expect(res.status).toBe(409);
		expect(res.body.message).toMatch(/email already in use/i);
	});

	it("should fail if fullName is missing", async () => {
		const res = await request(app).post("/signup").send({
			email: "bob@example.com",
			password: "password",
		});
		expect(res.status).toBe(400);
		expect(res.body.message).toBe("All fieled are required for signup.");
	});

	it("should fail if email is missing", async () => {
		const res = await request(app).post("/signup").send({
			fullName: "Bob",
			password: "password",
		});
		expect(res.status).toBe(400);
		expect(res.body.message).toBe("All fieled are required for signup.");
	});

	it("should fail if password is missing", async () => {
		const res = await request(app).post("/signup").send({
			fullName: "Bob",
			email: "bob@example.com",
		});
		expect(res.status).toBe(400);
		expect(res.body.message).toBe("All fieled are required for signup.");
	});
});

describe("User Routes: POST /login", () => {
	it("should login successfully with correct credentials", async () => {
		// Create a new user
		const user = await User.create({
			fullName: "Alice",
			email: "alice@example.com",
			password: "password123",
		});

		// Login
		const res = await request(app).post("/login").send({
			email: "alice@example.com",
			password: "password123",
		});

		expect(res.status).toBe(200);
		expect(res.body.message).toBe("Login successfully.");
		expect(res.body.data.email).toBe(user.email);
	});

	it("should fail login if email does not exist", async () => {
		const res = await request(app).post("/login").send({
			email: "nonexistent@example.com",
			password: "password123",
		});

		expect(res.status).toBe(401);
		expect(res.body.message).toBe("Invalid credentials!");
	});

	it("should fail login if password is incorrect", async () => {
		await User.create({
			fullName: "Alice",
			email: "alice@example.com",
			password: "password123",
		});

		const res = await request(app).post("/login").send({
			email: "alice@example.com",
			password: "wrongpassword",
		});

		expect(res.status).toBe(401);
		expect(res.body.message).toBe("Invalid credentials!");
	});

	it("should fail login if email is missing", async () => {
		const res = await request(app).post("/login").send({
			// missing email
			password: "password123",
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("All fieled are required for login.");
	});

	it("should fail login if password is missing", async () => {
		const res = await request(app).post("/login").send({
			email: "alice@example.com",
			// missing password
		});

		expect(res.status).toBe(400);
		expect(res.body.message).toBe("All fieled are required for login.");
	});
});

describe("User Routes: POST /logout", () => {
	it("should logout successfully and clear the accessToken cookie", async () => {
		const res = await request(app).post("/logout");

		expect(res.status).toBe(200);
		expect(res.body.error).toBe(false);
		expect(res.body.messsage).toBe("Logout successfully.");
		expect(res.body.data).toBeNull();

		// Check that cookie is cleared
		const cookies = res.headers["set-cookie"];
		expect(cookies).toBeDefined();
		expect(cookies.some((cookie) => cookie.startsWith("accessToken=;"))).toBe(
			true
		);

		// console.log(res.headers);
		// console.log(res.headers["set-cookie"]);
	});
});
