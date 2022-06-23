import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infra/config/environment-config/environment-config.module';

@Module({
  imports: [EnvironmentConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
