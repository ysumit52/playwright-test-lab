import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsyncModule } from './async/async.module';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { ProductsModule } from './products/products.module';
import { TestSupportModule } from './test-support/test-support.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        database: configService.get<string>('DB_NAME', 'playwright_lab'),
        username: configService.get<string>(
          'DB_USERNAME',
          'playwright_user',
        ),
        password: configService.get<string>(
          'DB_PASSWORD',
          'playwright_password',
        ),
        autoLoadEntities: true,

        // Only use synchronization for this development/testing playground.
        synchronize:
          configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',

        logging:
          configService.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),

    AuthModule,
    ProductsModule,
    FormsModule,
    AsyncModule,
    TestSupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}