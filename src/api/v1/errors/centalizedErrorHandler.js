export const centralizedErrorHandler = async (err, req, res, next) => {
	const statusCode = err.status || 500;
	if (statusCode >= 500 && process.env.NODE_ENV !== "production") {
		console.error(err.stack);
	} else {
		console.error(err.message);
	}
	res.status(err.status || 500).json({
		error: true,
		status: statusCode,
		message: err.message || "Internal Server Error",
	});
};