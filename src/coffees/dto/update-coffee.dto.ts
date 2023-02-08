import { PartialType } from '@nestjs/mapped-types'
import { CreateCoffeeDto } from './create-coffee.dto'

// Partial type returns the type of class we passed on to it with all the properties as optional, inherits all validations
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) { }
