class CustomAPIError extends Error {
    constructor(
        message: string,
        readonly statusCode: number
    ) {
        super(message);
    }
}

export default CustomAPIError;
