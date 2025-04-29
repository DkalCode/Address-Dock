/* eslint-disable @typescript-eslint/no-explicit-any */
class Validator {
  public constructor() {}

  // For every value in the array, check if it is null or undefined.
  // If all values are null or undefined, return true.
  // Otherwise, return false.
  static isNullOrUndefined(value: any[]): boolean {
    return value.every((val) => val == null || val == undefined);
  }
}

export default Validator;
