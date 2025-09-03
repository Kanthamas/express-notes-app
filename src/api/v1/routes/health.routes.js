import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({
		error: false,
		message: "API is healthy -- ready to serve",
		data: null,
	});
});
export default router;
