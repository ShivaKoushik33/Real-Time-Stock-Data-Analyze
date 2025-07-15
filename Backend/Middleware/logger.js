const logger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl } = req;

    // Capture response status and time
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        
        console.log(
            `[${new Date().toISOString()}] ${method} ${originalUrl} ` +
            `Status: ${statusCode} ${duration}ms`
        );
    });

    next();
};

module.exports = logger;