export class TypeConverter {
  static convertInstanceValuesToArray(input: any): any {
    const result: any = {};

    Object.keys(input).forEach((key) => {
      const value = input[key];
      result[key] = Array.isArray(value) ? value : [value];
    });

    return result;
  }
}
