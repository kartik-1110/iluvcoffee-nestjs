import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity/flavor.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>
    ) { }

    /* find all coffees */
    findAll() {
        return this.coffeeRepository.find({
            relations: ['flavors']
        });
    }

    /* find one coffee */
    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: { id: parseInt(id) },
            relations: ['flavors']
        })
        if (!coffee) {
            throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND)
        }
        return coffee
    }

    /* create a new coffee */
    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
            createCoffeeDto.flavours.map(name => this.preloadFlavorByName(name))
        )

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        })
        return this.coffeeRepository.save(coffee)
    }

    /* update an existing coffee */
    async update(id: string, updateCoffeeDto: any) {
        const flavors = updateCoffeeDto.flavors && 
        (await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))))

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        })
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`)
        }
        return this.coffeeRepository.save(coffee)
    }

    /* remove an existing coffee */
    async remove(id: string) {
        const coffee = await this.findOne(id)
        return this.coffeeRepository.remove(coffee)
    }

    /* this function checks if the flavor exists in the table, if it does not exist it creates a new entry in flavor table */
    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepository.findOne({ where:{name} })
        if (existingFlavor) {
            return existingFlavor
        }
        return this.flavorRepository.create({ name })
    }
}
