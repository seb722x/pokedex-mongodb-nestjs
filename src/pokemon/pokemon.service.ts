import { BadRequestException, HttpCode, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>
  ){}




  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try{
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;
     }catch(error){
    if (error.code === 11000){
    
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST, // Código de estado HTTP personalizado
      message: `Pokemon already exists in the database ${JSON.stringify(error.keyvalue)}`,
    });
    }
    console.log(error)
    throw new InternalServerErrorException(`can not create new pokemon, check server logs`)
  }
  
  
   
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async  findOne(term: string) {
    let pokemon : Pokemon;

    if (!isNaN(+term)){
      pokemon = await this.PokemonModel.findOne({no: term})
  }

  //MongoId
    if(!pokemon && isValidObjectId( term ) ) {
      pokemon = await this.PokemonModel.findById( term );
    }
  //Name
    if ( !pokemon )
      pokemon = await this.PokemonModel.findOne({name: term.toLowerCase().trim()})


    if (!pokemon)
    throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

    return pokemon;
  
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
