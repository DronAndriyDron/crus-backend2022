import { Module } from '@nestjs/common';
import { TaskshedulerService } from './tasksheduler.service';

@Module({
  providers: [TaskshedulerService]
})
export class TaskshedulerModule {}
