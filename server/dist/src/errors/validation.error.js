import { StatusCodes } from "../utils/constants.js";
class ValidationAPIError extends Error {
    errors;
    statusCode;
    constructor(errors) {
        super();
        this.errors = errors;
        this.statusCode = StatusCodes.BadRequest400;
    }
}
export default ValidationAPIError;
//# sourceMappingURL=validation.error.js.map