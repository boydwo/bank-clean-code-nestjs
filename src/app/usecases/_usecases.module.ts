import { Module } from '@nestjs/common';
import { CreateAccountUseCases } from './account/createAccount.usecases';
import { ShowAccountUseCases } from './account/showAccount.usecases';

@Module({
  imports: [],
  providers: [CreateAccountUseCases, ShowAccountUseCases],
  exports: [],
})
export class UsecasesModule {}
