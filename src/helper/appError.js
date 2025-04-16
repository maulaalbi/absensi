
// errors/AppError.ts
export class AppError extends Error {
    constructor(
       statusCode,
       message,
       details,
    ) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  