import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성 검사용 파이프. express의 middleware같은 느낌
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 데이터 형식에 맞지않게 온다면 validator에 도달하지 않는다.
      forbidNonWhitelisted: true, // 데이터 형식에 맞지않게 온다면 request 자체를 막는다.
      transform: true, // client가 보낸 데이터를 원하는 type으로 바꿔준다!!
    }),
  );

  await app.listen(3000);
}
bootstrap();
