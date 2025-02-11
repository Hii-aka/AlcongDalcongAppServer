import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LLMController } from './llm.controller';
import { LLMClient } from './llm.client';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [LLMController],
  providers: [LLMClient],
  exports: [LLMClient],
})
export class LLMModule {}
