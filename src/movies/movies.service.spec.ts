import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  // 각각의 테스트 함수가 실행되기 전에 매번 실행됩니다
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    // 초기 데이터를 여러 테스트에 중복되는걸 방지
    service.create({
      title: 'Test Movie',
      genres: ['test'],
      year: 2000,
    });
  });

  // beforeEach(), afterEach() - 각각의 테스트 함수가 실행되기 전 후에 매번 실행됩니다.
  // beforeAll(), afterAll() - 맨 처음과 맨 끝에 딱 한 번씩만 호출됩니다.

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // getAll()이 배열을 반환하는지 Test
  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      const movie = service.getOne(1);
      expect(movie).toBeDefined(); // 정의되어 있는지
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (error) {
        // 존재하지 않는 값을 get하여 getOne에서 throw를 하면
        expect(error).toBeInstanceOf(NotFoundException); // 에러가 NotFoundException인지
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      // 삭제 전 영화의 개수
      const beforeDelete = service.getAll().length;

      service.deleteOne(1); // 삭제

      // 삭제 후 영화의 개수
      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(beforeDelete); // 삭제 후 개수가 삭제 전 개수보다 작은지
    });

    it('should be return a 404', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException); // 에러가 NotFoundException인지
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      // 테스트 데이터 생성
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2000,
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.update(1, { title: 'Updated Test' });
      const movie = service.getOne(1);
      expect(movie.title).toEqual('Updated Test');
    });

    it('should throw a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException); // 에러가 NotFoundException인지
      }
    });
  });
});
