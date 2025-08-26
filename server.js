import express from "express";
import cors from "cors";
import morgan from "morgan";
import noteApiV1 from "./src/api/v1/routes.js";

const PORT = process.env.PORT || 4000;
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
app.listen(PORT, () => {
	console.log(
		`Notes App Server is running on Port: ${PORT}\nMode: ${process.env.NODE_ENV}`
	);
});
