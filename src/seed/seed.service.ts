import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {

  private readonly axios:AxiosInstance = axios;
  private readonly pokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=10"
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokeModel: Model<Pokemon>
  ){}

  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>(this.pokeUrl);
    const {results} = data

    results.forEach(async({name,url}) =>{

      const segments = url.split('/');
      const no = +segments[segments.length -2]
      console.log({name,no, segments});

      const poke = {name, no}
      console.log(poke)
      this.pokeModel.create(poke)
    }) 
  
    return data.results;
  }
}
