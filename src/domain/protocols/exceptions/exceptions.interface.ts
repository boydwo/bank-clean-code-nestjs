export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  badRequest(data: IFormatExceptionMessage): void;
  internalServerError(data?: IFormatExceptionMessage): void;
  forbidden(data?: IFormatExceptionMessage): void;
  Unauthorized(data?: IFormatExceptionMessage): void;
  notFound(data: IFormatExceptionMessage): void;
}
