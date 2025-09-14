import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRoutes from "./src/api/v1/routes/health.routes.js"
import userRoutes from "./src/api/v1/routes/user.routes.js";
import noteRoutes from "./src/api/v1/routes.js";
import uploadRoutes from "./src/api/v1/routes/upload.routes.js"

import { authUser } from "./src/api/v1/middlewares/authUser.js";
import { notFoundErrorHandler } from "./src/api/v1/errors/notFoundErrorHandler.js";
import { centralizedErrorHandler } from "./src/api/v1/errors/centalizedErrorHandler.js";

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

// Health check route
app.use(healthRoutes)

// Routes
app.use("/", userRoutes);
app.use("/notes", authUser, noteRoutes);
app.use("/upload", uploadRoutes)

// Error Handlers
app.use(notFoundErrorHandler);
app.use(centralizedErrorHandler);

export default app;
