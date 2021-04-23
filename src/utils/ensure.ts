// JS .find array method returns item OR undefined, causing extra typescript handling.
// This method ensures an item is found, otherwise throws an error.

const ensure = <T>(
    argument: T | undefined | null,
    message = 'This value was promised to be there.'
): T => {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }

    return argument;
};

export default ensure;
