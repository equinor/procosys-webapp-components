/**
 * This class should be used when catching errors from fetch calls.
 * Note: fetch will only throw error on network errors (or similar), but not when server respond with http error code.
 */
export class HTTPError extends Error {
    errorCode: number;
    errorMessage: string;

    constructor(errorCode: number, errorMessage: string) {
        super(errorMessage);
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
}
