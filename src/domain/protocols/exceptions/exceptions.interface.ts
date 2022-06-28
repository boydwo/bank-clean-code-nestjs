export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  badRequest(data: IFormatExceptionMessage): Error;
  internalServerError(data?: IFormatExceptionMessage): Error;
  forbidden(data?: IFormatExceptionMessage): Error;
  unauthorized(data?: IFormatExceptionMessage): Error;
  notFound(data: IFormatExceptionMessage): Error;
}
