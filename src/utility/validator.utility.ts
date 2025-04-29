/* eslint-disable @typescript-eslint/no-explicit-any */
class Validator {
  public constructor() {}

  // For every value in the array, check if it is null or undefined.
  // If all values are null or undefined, return true.
  // Otherwise, return false.
  static isNullOrUndefined(value: any[]): boolean {
    let isNullOrUndefined = false;
    value.forEach((val) => {
      if (val === undefined) {
        isNullOrUndefined = true;
      }
      if (val === null) {
        isNullOrUndefined = true;
      }
    });
    return isNullOrUndefined;
  }
}

export default Validator;
