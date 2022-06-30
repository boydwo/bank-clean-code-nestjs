import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ExceptionsService } from 'src/infra/exceptions/exceptions.infra';

interface SutTypes {
  sut: ExceptionsService;
}

const makeSut = (): SutTypes => {
  const sut = new ExceptionsService();
  return { sut };
};
describe('app :: infra :: exception :: ExceptionService ', () => {
  it('should call badRequest method with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.badRequest({ message: 'Error' });

    expect(response).toBeInstanceOf(BadRequestException);
    expect(response).toEqual(new BadRequestException({ message: 'Error' }));
  });
  it('should call internalServerError method with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.internalServerError({ message: 'Error' });

    expect(response).toBeInstanceOf(InternalServerErrorException);
    expect(response).toEqual(
      new InternalServerErrorException({ message: 'Error' })
    );
  });
  it('should call forbidden method with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.forbidden({ message: 'Error' });

    expect(response).toBeInstanceOf(ForbiddenException);
    expect(response).toEqual(new ForbiddenException({ message: 'Error' }));
  });
  it('should call unauthorized method with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.unauthorized({ message: 'Error' });

    expect(response).toBeInstanceOf(UnauthorizedException);
    expect(response).toEqual(new UnauthorizedException({ message: 'Error' }));
  });
  it('should call notFound method with correct values', async () => {
    const { sut } = makeSut();

    const response = await sut.notFound({ message: 'Error' });

    expect(response).toBeInstanceOf(NotFoundException);
    expect(response).toEqual(new NotFoundException({ message: 'Error' }));
  });
});
