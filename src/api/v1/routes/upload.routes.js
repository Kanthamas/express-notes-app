import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { uploadMultiple } from "../middlewares/uploadMultiple.js";
import { uploadImages } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", upload.array("images"), uploadMultiple, uploadImages);

export default router;
