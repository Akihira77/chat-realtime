class CustomAPIError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export default CustomAPIError;
//# sourceMappingURL=custom.error.js.map