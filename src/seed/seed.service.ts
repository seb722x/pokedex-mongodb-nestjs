import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  private readonly pokeUrl = "https://pokeapi.co/api/v2/pokemon?limit=640"
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokeModel: Model<Pokemon>,

    private readonly http:AxiosAdapter,
  ){}

  async executeSeed() {

    await this.pokeModel.deleteMany();

    const data = await this.http.get<PokeResponse>(this.pokeUrl);
    const pokemonToInsert:{name:string, no: number}[] = [];

    data.results.forEach(async({name,url}) =>{

      const segments = url.split('/');
      const no = +segments[segments.length - 2]
      //console.log({name,no, segments});

      pokemonToInsert.push({name,no})
    });
    const inserted = await this.pokeModel.insertMany(pokemonToInsert);
    return inserted
    
  }
}
