import Note from "../models/note.model.js";

export const createNote = async (req, res, next) => {
	try {
		const { title, content, tags = [] } = req.body;

		if (!title || !content) {
			const err = new Error("Title and content are required");
			err.status = 400;
			return next(err);
		}

		const note = await Note.create({ title, content, tags });
		res.status(201).json({ error: false, data: note });
	} catch (error) {
		next(error);
	}
};

export const getAllNotes = async (req, res, next) => {
	try {
		const notes = await Note.find().sort({ createdAt: -1 });
		res.status(200).json({
			error: false,
			data: notes,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteNote = async (req, res, next) => {
	try {
		const noteId = req.params.noteId;

		const note = await Note.findById(noteId);

		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		await note.deleteOne();

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

export const updateNote = async (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;

		if (!title || !content) {
			const err = new Error("Title and content are required for update note");
			err.status = 400;
			return next(err);
		}

		const note = await Note.findById(noteId);

		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		// update logic
		note.title = title;
		note.content = content;
		note.tags = tags;

		const updatedNote = await note.save();
		res.status(200).json({ error: false, data: updatedNote });
	} catch (error) {
		next(error);
	}
};

export const patchNote = async (req, res, next) => {
	try {
		const noteId = req.params.noteId;
		const { title, content, tags } = req.body;

		const note = await Note.findById(noteId);

		if (!note) {
			const err = new Error("Note not found");
			err.status = 404;
			return next(err);
		}

		if (title !== undefined) note.title = title;
		if (content !== undefined) note.content = content;
		if (tags !== undefined) note.tags = tags;

		const updatedNote = await note.save();

		res.status(200).json({ error: false, data: updatedNote });
	} catch (error) {
		next(error);
	}
};
