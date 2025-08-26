import { Schema, model } from "mongoose";

const noteSchema = new Schema(
	{
		title: { type: String, require: true },
		content: { type: String, require: true },
		tags: { type: [String], default: [] },
	},
	{ timestamps: true }
);

const Note = model("Note", noteSchema)

export default Note