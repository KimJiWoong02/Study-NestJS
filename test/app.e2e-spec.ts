import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // beforeEach로 createNestApplication()로 테스트마다 어플리케이션을 생성하고있다...
  // beforeAll로 바꿔주기만 해도 테스트 시작 전 1번만 실행하기에 해결이 가능하다.
  // ( 여기서 생성하는 App은 Test App이지 실제 브라우저에서 테스트 할 수 있는 App은 아니다 )
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 문제. get('/movies/1')을 테스트 하니 200이 아닌 404가 나온다?
    // 원인. App을 생성했지만 어떤 pipe에도 올리지 않았다.
    //      (실행 환경이 다르니 transform이 안돼 string이 number로 변환이 되지않아 찾을 수 없어 404가 반환된 것)
    // 해결. 테스트에서도 실제 App 환경을 그대로 적용시켜줘야한다.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 데이터 형식에 맞지않게 온다면 validator에 도달하지 않는다.
        forbidNonWhitelisted: true, // 데이터 형식에 맞지않게 온다면 request 자체를 막는다.
        transform: true, // client가 보낸 데이터를 원하는 type으로 바꿔준다!!
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Test',
          year: 2000,
          genres: ['Test'],
        })
        .expect(201);
    });

    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Test',
          year: 2000,
          genres: ['Test'],
          other: 'thing',
        })
        .expect(400);
    });

    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });

    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'Updated Test' })
        .expect(200);
    });

    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
