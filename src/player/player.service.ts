import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {editIsInClubDto} from 'src/dto/editIsInClubDto.dto';
import {EditPlayerDto} from 'src/dto/editPlayer.dto';
import {Players} from 'src/entities/players.entity';
import {Rates} from 'src/entities/rates.entity';
import {Ratings} from 'src/entities/ratings.entity';
import {Repository} from 'typeorm';
import {getPlayersDto} from "../dto/getPlayers.dto";
import {addPlayerDto} from "../dto/addPlayer.dto";
import {ShopElement} from "../entities/shopElement.entity";
import {Users} from "../entities/user.entity";

const axios = require('axios');


@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Players) private players_repository: Repository<Players>,
    @InjectRepository(Ratings) private players_ratings_repository: Repository<Ratings>,
    @InjectRepository(Rates) private rates_repository: Repository<Rates>,
    @InjectRepository(ShopElement) private shopElement_repository: Repository<ShopElement>,
    @InjectRepository(Users) private users_repository: Repository<Users>
  ) {
  }

  async editIsInClub(dto: editIsInClubDto) {
    const player = await this.players_repository.findOne({
      where: {
        id: dto.playerId
      }
    })

    if (!player) {
      throw new HttpException("this player not exist", HttpStatus.NOT_FOUND)
    }

    player.isInClub = dto.isInClub;

    const savedPlayer = await this.players_repository.save(player)

    return savedPlayer;
  }

  async updatePlayers() {
    const players = await this.players_repository.find()
    const playersAPIIds = players.map(player => player.idAPI)

    const config = {
      method: 'get',
      url: 'https://v3.football.api-sports.io/players/squads?team=' + process.env.TEAM_ID,
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    const playersToAdd = await axios(config)
      .then(response => {
        return response.data.response[0].players
      })
      .then(result => {
        const filteredPlayers = result.filter(player => !playersAPIIds.includes(player.id))

        const resultToReturn = filteredPlayers.map(item => {
          const pre_saved_data = new Players()

          pre_saved_data.idAPI = item.id
          pre_saved_data.nameAPI = item.name
          pre_saved_data.number = item.number ? item.number : 99
          pre_saved_data.position = item.position

          return pre_saved_data
        })

        return resultToReturn
      })


    const savedData = await this.players_repository.save(playersToAdd)

    return {
      message: 'Success added',
      players: savedData
    };
  }

  async getPlayers(dto) {
    const players = await this.players_repository.find({
      order: {
        id: 'DESC'
      },
      skip: dto.page * 18,
      take: 18,
      where: {isInClub: false}
    })

    const length = await this.players_repository.count({where: {isInClub: false}})

    // ShopElements
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.id IN (:...ids)", { ids: elementsIds })
      .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })

    return {
      length,
      players,
      shopElements: shopElements
    };
  }

  async getPlayersInClub(dto) {
    const players = await this.players_repository.find({
        where: {
          isInClub: true,
        },
        order: {
          id: 'DESC'
        },
        skip: dto.page * 18,
        take: 18
      }
    )

    const length = await this.players_repository.count({where: {isInClub: true}})


    if (!players) {
      throw new HttpException("this players not exist", HttpStatus.NOT_FOUND)
    }

    // ShopElements
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.id IN (:...ids)", { ids: elementsIds })
      .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })


    return {
      players,
      shopElements,
      length
    };
  }

  async editPlayer(dto: EditPlayerDto, file) {
    const player = await this.players_repository.findOne({
      where: {id: dto.id}
    })


    if (!player) {
      throw new HttpException("Player not exist", HttpStatus.NOT_FOUND);
    }

    if (dto.name) player.name = dto.name;
    if (dto.surname) player.surname = dto.surname;
    if (dto.number) player.number = dto.number;
    if (dto.position) player.position = dto.position;

    if (file) {
      player.image = file.path.substr(7, file.path.length);
    }

    const savedPlayer = await this.players_repository.save(player);


    return savedPlayer;

  }

  async getPlayerById(id: number) {
    const player = await this.players_repository.findOne(id)

    if (!player) {
      throw new HttpException("this player not exist", HttpStatus.NOT_FOUND)
    }

    return player
  }

}
