import { v2 as cloudinary } from "cloudinary";
import { couldinaryConfig } from "../config/cloudinaryConfig.js";
import streamifier from "streamifier";

couldinaryConfig();

export const uploadMultiple = async (req, res, next) => {
	try {
		const files = req.files;
		if (!files || files.length === 0) {
			return res.status(400).json({ message: "No files uploaded" });
		}

		let imagesURLs = [];

		// Helper: upload buffer to Cloudinary
		const streamUpload = (fileBuffer) => {
			return new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{
						resource_type: "auto",
						folder: "notesAppUploads", // ✅ Cloudinary folder
					},
					(error, result) => {
						if (result) resolve(result);
						else reject(error);
					}
				);
				streamifier.createReadStream(fileBuffer).pipe(stream);
			});
		};

		for (let file of files) {
			const result = await streamUpload(file.buffer);
			imagesURLs.push(result.secure_url);
		}

		req.images = imagesURLs;
		// console.log(`res.images: ${req.images}`);
		next();
	} catch (error) {
		next(error);
	}
};
