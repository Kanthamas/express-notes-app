import { Schema, model } from "mongoose";

const noteSchema = new Schema(
	{
		userId: { type: String, required: true },
		title: { type: String, require: true },
		content: { type: String, require: true },
		tags: { type: [String], default: [] },
		schemaVersion: { type: Number, default: 1 },
	},
	{ timestamps: true }
);

const Note = model("Note", noteSchema);

noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ tags: 1 });

export default Note;
