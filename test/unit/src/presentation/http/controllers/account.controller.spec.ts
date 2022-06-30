import { ICreateAccountUsecases } from 'src/domain/protocols/usecases/account/createAccount.usecases.interface';
import { IDeleteAccountUsecases } from 'src/domain/protocols/usecases/account/deleteAccount.usecases.interface';
import { IShowAccountUsecases } from 'src/domain/protocols/usecases/account/showAccount.usecases.interface';
import { IUpdateAccountUsecases } from 'src/domain/protocols/usecases/account/updateAccount.usecases.interface';
import { AccountController } from 'src/presentation/http/controllers/account.controller';

interface SutTypes {
  sut: AccountController;
  makeCreateAccountUsecases: ICreateAccountUsecases;
  makeShowAccountUsecases: IShowAccountUsecases;
  makeUpdateAccountUsecases: IUpdateAccountUsecases;
  makeDeleteAccountUsecases: IDeleteAccountUsecases;
}

const makeSut = (): SutTypes => {
  const makeCreateAccountUsecases: ICreateAccountUsecases = {
    execute: jest.fn()
  };
  const makeShowAccountUsecases: IShowAccountUsecases = {
    execute: jest.fn()
  };
  const makeUpdateAccountUsecases: IUpdateAccountUsecases = {
    execute: jest.fn()
  };
  const makeDeleteAccountUsecases: IDeleteAccountUsecases = {
    execute: jest.fn()
  };

  const sut = new AccountController(
    makeCreateAccountUsecases,
    makeShowAccountUsecases,
    makeUpdateAccountUsecases,
    makeDeleteAccountUsecases
  );
  return {
    sut,
    makeCreateAccountUsecases,
    makeShowAccountUsecases,
    makeUpdateAccountUsecases,
    makeDeleteAccountUsecases
  };
};
describe('app :: presentation :: http :: AccountController', () => {
  const accountData = {
    name: 'John Doe',
    document: '9999999999',
    email: 'john@doe.com',
    telephone: '55319999999',
    address: 'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP'
  };

  it('should call createAccount method with correct values', async () => {
    const { sut, makeCreateAccountUsecases } = makeSut();

    await sut.createAccount(accountData);

    expect(makeCreateAccountUsecases.execute).toHaveBeenCalledWith(
      'John Doe',
      '9999999999',
      'john@doe.com',
      '55319999999',
      'Av das Palmeiras, 444, Bandeiranantes, 32415788, São Paulo, SP'
    );
  });
  it('should call getAccount method with correct values', async () => {
    const { sut, makeShowAccountUsecases } = makeSut();

    await sut.getAccount(1);

    expect(makeShowAccountUsecases.execute).toHaveBeenCalledWith(1);
  });
  it('should call updateAccount method with correct values', async () => {
    const { sut, makeUpdateAccountUsecases } = makeSut();

    await sut.updateAccount(1, {
      name: 'John Teste',
      email: 'john@teste.com',
      telephone: '31231',
      address: 'Rua Teste 22'
    });

    expect(makeUpdateAccountUsecases.execute).toHaveBeenCalledWith(1, {
      name: 'John Teste',
      email: 'john@teste.com',
      telephone: '31231',
      address: 'Rua Teste 22'
    });
  });
  it('should call deleteAccount method with correct values', async () => {
    const { sut, makeDeleteAccountUsecases } = makeSut();

    await sut.deleteAccount(1);

    expect(makeDeleteAccountUsecases.execute).toHaveBeenCalledWith(1);
  });
});
