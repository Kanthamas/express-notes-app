import { Router } from "express";
import { formatUptime } from "../../utils/formatUptime.js";
import {
	createNote,
	getAllNotes,
	deleteNote,
	updateNote,
	patchNote,
} from "./controllers/note.controller.js";

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

// Routes: /notes
router.post("/notes", createNote);

router.get("/notes", getAllNotes);

router.delete("/notes/:noteId", deleteNote);

router.put("/notes/:noteId", updateNote);

router.patch("/notes/:noteId", patchNote);

// Testing Route for 500
router.get("/error-test", (req, res, next) => {
	throw new Error("Forced server error for testing");
});

export default router;
