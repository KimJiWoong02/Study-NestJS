import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

// url == .../movies
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  // NestJS는 Express 위에서 돌아간다.
  // Req, Res 같은 decorator를 이용해 Express에 접근할 수 있다. Ex) getAll(@Req() req, @Res() res) {}
  // => 하지만 추천하지 않는다.
  // NestJS는 두 개의 프레임워크와 작동한다. (기본적으로 Express 위에서 실행되지만 Fastify로 전환이 가능하다)
  // Fastify처럼 Express와 다른 방법을 쓰고 싶을 수 있기 때문이다.

  @Get(':id')
  getOne(@Param('id') movieId: number): Movie {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }

  @Delete(':id')
  remove(@Param('id') movieId: number) {
    return this.moviesService.deleteOne(movieId);
  }

  @Patch(':id')
  patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto) {
    return this.moviesService.update(movieId, updateData);
  }
}
