export const isOfType = <T>(
    varToBeChecked: unknown,
    propertyToCheckFor: keyof T
): varToBeChecked is T => {
    return (varToBeChecked as T)[propertyToCheckFor] !== undefined;
};

export const isArrayOfType = <T>(
    dataToBeChecked: unknown,
    propertyToCheckFor: keyof T
): dataToBeChecked is T[] => {
    return (
        Array.isArray(dataToBeChecked) &&
        dataToBeChecked.every((item) => isOfType<T>(item, propertyToCheckFor))
    );
};

export function assertIsError(error: unknown): asserts error is Error {
    if (!(error instanceof Error)) {
        throw error;
    }
}
