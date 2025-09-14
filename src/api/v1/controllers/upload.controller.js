export const uploadImages = async (req, res, next) => {
	try {
		if (!req.images || req.images.length === 0) {
			return res
				.status(400)
				.json({ error: true, message: "No images uploaded", data: null });
		}

		res.status(200).json({
			error: false,
			message: "Images uploaded successfully",
			data: { images: req.images },
		});
	} catch (error) {
		next(error);
	}
};
