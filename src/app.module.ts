import { Module } from '@nestjs/common';
import { InfraModule } from './infra/_infra.module';
import { PresentationModule } from './presentation/_presentation.module';

@Module({
  imports: [PresentationModule, InfraModule],
  controllers: [],
  providers: []
})
export class AppModule {}
