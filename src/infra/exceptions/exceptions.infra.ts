import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import {
  IException,
  IFormatExceptionMessage
} from 'src/domain/protocols/exceptions/exceptions.interface';

export class ExceptionsService implements IException {
  badRequest(data: IFormatExceptionMessage): Error {
    return new BadRequestException(data);
  }
  internalServerError(data?: IFormatExceptionMessage): Error {
    return new InternalServerErrorException(data);
  }
  forbidden(data?: IFormatExceptionMessage): Error {
    return new ForbiddenException(data);
  }
  unauthorized(data?: IFormatExceptionMessage): Error {
    return new UnauthorizedException(data);
  }
  notFound(data?: IFormatExceptionMessage): Error {
    return new NotFoundException(data);
  }
}
