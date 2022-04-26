import { IsNumber, IsOptional, IsString } from 'class-validator';

// 코드를 간결하게 하고, 쿼리의 유효성 검사를 위해 DTO 사용
// npm i class-validator class-transformer - class의 유효성을 검사하기 위해
export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsOptional() // undefined를 받을 수 있으면서 값이 존재할 때는 @IsString(), @IsNumber() 등으로 타입 체크도 가능하다.
  @IsString({ each: true }) // 유효성 검사 옵션. 모든 요소를 하나씩 검사
  readonly genres: string[];
}
