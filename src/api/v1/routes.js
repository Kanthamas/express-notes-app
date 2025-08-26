import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { formatUptime } from "../../utils/formatUptime.js";

const router = Router();

let notes = [];

router.get("/healthy", (req, res, next) => {
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

router.get("/", (req, res, next) => {
	try {
		res.send("Hello Client, I'm your server.");
	} catch (error) {
		next(error);
	}
});

router.post("/notes", (req, res, next) => {
	try {
		const { title, content, tags = [] } = req.body;

		if (!title || !content) {
			const err = new Error("All fields are required");
			err.status = 400;
			return next(err);
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

router.get("/notes", (req, res, next) => {
	try {
		res.status(200).json({
			error: false,
			data: notes,
		});
	} catch (err) {
		next(err);
	}
});

router.delete("/notes/:noteId", (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const noteIndex = notes.findIndex((note) => note.id === noteId);
		if (noteIndex !== -1) {
			// notes.splice(mnoteIndex, 1);
			notes = notes.filter((note) => note.id !== noteId);
			res.status(204).send();
		} else {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}
	} catch (error) {
		next(error);
	}
});

router.put("/notes/:noteId", (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;

		if (!title || !content) {
			const err = new Error("All fields are required for replacement");
			err.status = 400;
			return next(err);
		}

		const noteExists = notes.some((note) => note.id === noteId);
		if (!noteExists) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		const updatedNote = { id: noteId, title, content, tags };
		notes = notes.map((note) => (note.id === noteId ? updatedNote : note));

		res.status(200).json({ error: false, data: updatedNote });
	} catch (error) {
		next(error);
	}
});

router.patch("/notes/:noteId", (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;

		const note = notes.find((note) => note.id === noteId);
		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		const updates = {};
		if (title !== undefined) updates.title = title;
		if (content !== undefined) updates.content = content;
		if (tags !== undefined) updates.tags = tags;

		if (Object.keys(updates).length === 0) {
			const err = new Error("No fields provided to update");
			err.status = 400;
			return next(err);
		}

		const updatedNote = { ...note, ...updates };

		notes = notes.map((note) => (note.id === noteId ? updatedNote : note));

		res.status(200).json({ error: false, data: updatedNote });
	} catch (error) {
		next(error);
	}
});

// Testing Route for 500
router.get("/error-test", (req, res, next) => {
	throw new Error("Forced server error for testing");
});

export default router;
