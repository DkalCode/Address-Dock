class Validator {
  public constructor() {}

  static isNotNullOrUndefined(value: any[]): boolean {
    return !value.every((val) => val !== null && val !== undefined);
  }
}

export default Validator;
