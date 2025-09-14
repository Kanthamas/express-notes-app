import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		schemaVersion: { type: Number, default: 1 },
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Reuse model if already compiled (important for Vitest)
const User = model("User", UserSchema);

export default User;
