const errorHandler = (err, req, res, next) => {
	const statusCode = err.status || 500;

	const errorMessage = err.message || 'Internal server error';
	
	res.status(statusCode).json({
		success: false,
		message: errorMessage,
		statusCode,
	});
};
export default errorHandler;
