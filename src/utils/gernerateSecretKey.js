import { randomBytes } from "node:crypto";

export const generateSecretKey = () => {
	return randomBytes(64).toString("hex")
};

console.log(generateSecretKey())