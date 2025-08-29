export const notFoundErrorHandler = async (req, res) => {
	res.status(404).json({
		error: true,
		status: 404,
		message: "Resource not found",
	});
};
