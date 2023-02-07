import { IsOptional, IsPositive } from "class-validator"

/* DTO for pagination */ 
export class PaginationQueryDto {
    @IsOptional()
    @IsPositive()
    limit: number

    @IsOptional()
    @IsPositive()
    offset: number
}
