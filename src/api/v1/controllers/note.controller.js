import Note from "../models/note.model.js";

export const createNote = async (req, res, next) => {
	try {
		// Validate inputs and userId
		const { title, content, tags = [] } = req.body;
		const userId = req.user._id;
		if (!title || !content || !userId) {
			const err = new Error("Title, content, and userId are required");
			err.status = 400;
			return next(err);
		}

		// Create a new note
		const note = await Note.create({ title, content, tags, userId });
		res.status(201).json({
			error: false,
			message: "Note created successfully.",
			data: note,
		});
	} catch (error) {
		next(error);
	}
};

export const getAllNotes = async (req, res, next) => {
	try {
		// Validate userId
		const userId = req.user._id;
		if (!req.user || !userId) {
			const err = new Error("No user found in request object!");
			err.status = 401;
			return next(err);
		}

		// Validate query
		let filter = { userId };

		for (let key in req.query) {
			filter[key] = req.query[key];
		}

		// Find notes by userId
		const notes = await Note.find(filter).sort({ updatedAt: -1 });
		const totalNotes = await Note.find(filter).sort({ updatedAt: -1 }).countDocuments();
		res.status(200).json({
			error: false,
			message: "Get all notes successfully.",
			data: {notes, totalNotes}})
	} catch (err) {
		next(err);
	}
};

export const deleteNote = async (req, res, next) => {
	try {
		// Validate userId
		const userId = req.user._id;
		if (!req.user || !userId) {
			const err = new Error("No user found in request object!");
			err.status = 401;
			return next(err);
		}

		// Validate noteId
		const noteId = req.params.noteId;

		const note = await Note.findById(noteId);

		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		// Delete note
		await note.deleteOne();

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

export const updateNote = async (req, res, next) => {
	try {
		// Validate userId, noteId, inputs
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;
		const userId = req.user._id;
		if (!req.user || !userId) {
			const err = new Error("No user found in request object!");
			err.status = 401;
			return next(err);
		}

		if (!title || !content) {
			const err = new Error("Title and content are required for update note");
			err.status = 400;
			return next(err);
		}

		// Validate valid note
		const note = await Note.findOne({ _id: noteId, userId: userId });
		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		// Update logic
		note.title = title;
		note.content = content;
		note.tags = tags;

		const updatedNote = await note.save();
		res.status(200).json({
			error: false,
			message: "Note updated successfully.",
			data: updatedNote,
		});
	} catch (error) {
		next(error);
	}
};

export const patchNote = async (req, res, next) => {
	try {
		// Validate userId, noteId, inputs
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;
		const userId = req.user._id;
		if (!req.user || !userId) {
			const err = new Error("No user found in request object!");
			err.status = 401;
			return next(err);
		}

		// Validate valid note
		const note = await Note.findOne({ _id: noteId, userId: userId });
		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		if (title !== undefined) note.title = title;
		if (content !== undefined) note.content = content;
		if (tags !== undefined) note.tags = tags;

		const updatedNote = await note.save();

		res.status(200).json({
			error: false,
			message: "Note edited successfully.",
			data: updatedNote,
		});
	} catch (error) {
		next(error);
	}
};
