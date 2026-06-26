import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { LogginMiddleware } from './loggin/loggin.middleware';

@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 100,
                },
            ],
        }),
    ],
    providers: [LogginMiddleware]
})
export class MiddlewareModule {}
