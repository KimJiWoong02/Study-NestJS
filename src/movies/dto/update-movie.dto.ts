import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

// npm i @nestjs/mapped-type - 타입을 변환시키고 사용할 수 있게하는 패키지
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
