import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { formatUptime } from "./src/utils/formatUptime.js";

const PORT = process.env.PORT || 4000;
const app = express();

// Middlewares
app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:5174"],
	})
);

let notes = [];

// Routes
app.get("/healthy", (req, res, next) => {
	try {
		const uptimeSeconds = process.uptime();

		res.status(200).json({
			status: "ok",
			uptime: formatUptime(uptimeSeconds),
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		next(error);
	}
});

app.get("/", (req, res, next) => {
	try {
		res.send("Hello Client, I'm your server.");
	} catch (error) {
		next(error);
	}
});

app.post("/notes", (req, res, next) => {
	try {
		const { title, content, tags = [] } = req.body;

		if (!title || !content) {
			return res.status(400).json({
				error: true,
				message: "All fields are required",
			});
		}

		const newNote = {
			id: uuidv4(),
			title: title,
			content: content,
			tags: tags,
		};

		notes = [...notes, newNote];
		res.status(201).json({ error: false, data: newNote });
	} catch (error) {
		next(error);
	}
});

app.get("/notes", (req, res, next) => {
	try {
		res.status(200).json({
			error: false,
			data: notes,
		});
	} catch (err) {
		next(err);
	}
});

app.delete("/notes/:noteId", (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const noteIndex = notes.findIndex((note) => note.id === noteId);
		if (noteIndex !== -1) {
			// notes.splice(mnoteIndex, 1);
			notes = notes.filter((note) => note.id !== noteId);
			res.status(204).send();
		} else {
			res.status(404).json({ error: true, message: "Note not found!" });
		}
	} catch (error) {
		next(error);
	}
});

app.put("/notes/:noteId", (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;

		if (!title || !content) {
			return res.status(400).json({
				error: true,
				message: "All fields are required for replacement",
			});
		}

		const noteExists = notes.some((note) => note.id === noteId);
		if (!noteExists) {
			return res.status(404).json({ error: true, message: "Note not found!" });
		}

		const updatedNote = { id: noteId, title, content, tags };
		notes = notes.map((note) => (note.id === noteId ? updatedNote : note));

		res.status(200).json({ error: false, data: updatedNote });
	} catch (error) {
		next(error);
	}
});

app.patch("/notes/:noteId", (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;

		const note = notes.find((note) => note.id === noteId);
		if (!note) {
			return res.status(404).json({ error: true, message: "Note not found!" });
		}

		const updates = {};
		if (title !== undefined) updates.title = title;
		if (content !== undefined) updates.content = content;
		if (tags !== undefined) updates.tags = tags;

		const updatedNote = { ...note, ...updates };

		notes = notes.map((note) => (note.id === noteId ? updatedNote : note));

		res.status(200).json({ error: false, data: updatedNote });
	} catch (error) {
		next(error);
	}
});

// Testing Route for 500
app.get("/error-test", (req, res, next) => {
	throw new Error("Forced server error for testing");
});

// Error Handlers
app.use((req, res) => {
	res.status(404).json({
		error: true,
		message: "Resource not found",
	});
});

app.use((err, req, res, next) => {
	console.error("Error:", err.message);
	res.status(500).json({
		error: true,
		message: err.message || "Internal Server Error",
	});
});

// Server
app.listen(PORT, () => {
	console.log(`Notes App Server is running on Port: ${PORT}`);
});
