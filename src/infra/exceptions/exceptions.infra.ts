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
  badRequest(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  internalServerError(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  forbidden(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
  unauthorized(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
  notFound(data?: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
}
