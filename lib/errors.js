export class ApiError extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.msg = msg;
    }
}

export class BadRequestError extends ApiError {
    constructor(msg = 'Bad request') {
        super(400, msg);
    }
}

// Error Handler
export default (err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.msg || 'oops';
    console.log(status, msg);
    return res.status(status).json({
        error: {
            msg,
            status,
        },
    });
};
