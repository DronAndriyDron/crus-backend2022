import {HttpException, HttpStatus, Injectable, Post} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';

import {addRatesDto} from 'src/dto/addRates.dto';
import {Games} from 'src/entities/games.entity';
import {Players} from 'src/entities/players.entity';
import {Rates} from 'src/entities/rates.entity';
import {Seasons} from 'src/entities/seasons.entity';
import {Users} from 'src/entities/user.entity';
import {Repository} from 'typeorm';
import {RatesCaptains} from "../entities/ratesCaptains.entity";
import {RatesLineups} from "../entities/ratesLineups.entity";
import {editRateDto} from "../dto/editRate.dto";

@Injectable()
export class RatesService {

  constructor(
    @InjectRepository(Players) public players_repository: Repository<Players>,
    @InjectRepository(Rates) public rates_repository: Repository<Rates>,
    @InjectRepository(Users) public users_repository: Repository<Users>,
    @InjectRepository(Games) public games_repository: Repository<Games>,
    @InjectRepository(Seasons) public seasons_repository: Repository<Seasons>,
    @InjectRepository(RatesCaptains) public ratesCaptains_repository: Repository<RatesCaptains>,
    @InjectRepository(RatesLineups) public ratesLineups_repository: Repository<RatesLineups>
  ) {
  }


  // Checked

  async addRate(dto: addRatesDto) {
    const game = await this.games_repository.findOne({where: {id: dto.gameId}})
    const user = await this.users_repository.findOne({where: {id: dto.userId}})

    if (Date.now() - new Date(game.date).getTime() > -7200000) {
      throw new HttpException("you cant add forecast now", HttpStatus.NOT_FOUND);
    }

    if (!game) throw new HttpException("game з вказаним айді не існує", HttpStatus.NOT_FOUND);
    if (!user) throw new HttpException("user з вказаним айді не існує", HttpStatus.NOT_FOUND);


    // Add Rate
    const rate = new Rates()
    rate.formation = dto.formation
    rate.passes = dto.passes
    rate.successPasses = dto.successPasses
    rate.shots = dto.shots
    rate.successShots = dto.successShots
    rate.dribbles = dto.dribbles
    rate.successDribbles = dto.successDribbles
    rate.ballAccuracy = dto.ballAccuracy
    rate.user = user
    rate.game = game


    const savedRate = await this.rates_repository.save(rate)

    const captainsPlayersIds = dto.captains.map(player => player.playerId)
    const captainsFormToSet = {}

    if (captainsPlayersIds.length !== 3) {
      throw new HttpException("error with captains", HttpStatus.BAD_REQUEST)
    }

    const captainsPlayersToSet = await this.players_repository.createQueryBuilder("Player")
      .where("Player.id IN (:...id)", { id: captainsPlayersIds })
      .getMany();

    captainsPlayersToSet.forEach(player => {
      captainsFormToSet[player.id] = player
    })

    const ratesCaptainsToSave = dto.captains.map(item => {
      const newRatesCaptains = new RatesCaptains()

      newRatesCaptains.rates = savedRate
      newRatesCaptains.player = captainsFormToSet[item.playerId]
      newRatesCaptains.position = item.position

      return newRatesCaptains
    })


    // Add Lineup

    const lineupsPlayersIds = dto.lineups.map(player => player.playerId)
    const lineupsFormToSet = {}

    if (lineupsPlayersIds.length !== 11) {
      throw new HttpException("error with lineup", HttpStatus.BAD_REQUEST)
    }

    const lineupsPlayersToSet = await this.players_repository.createQueryBuilder("Player")
      .where("Player.id IN (:...id)", { id: lineupsPlayersIds })
      .getMany();


    lineupsPlayersToSet.forEach(player => {
      lineupsFormToSet[player.id] = player
    })

    const ratesLineupsToSave = dto.lineups.map(item => {
      const newRatesLineups = new RatesLineups()

      newRatesLineups.rates = savedRate
      newRatesLineups.player = lineupsFormToSet[item.playerId]
      newRatesLineups.role = item.position


      return newRatesLineups
    })


    const savedRatesCaptains = await this.ratesCaptains_repository.save(ratesCaptainsToSave)
    const savedRatesLineups = await this.ratesLineups_repository.save(ratesLineupsToSave)


    return {
      savedRate,
      savedRatesCaptains,
      savedRatesLineups,
    }
  }

  async editRate(dto: editRateDto) {
    const rate = await this.rates_repository.findOne({where: {id: dto.rateId}})
    const game = await this.games_repository.findOne({where: {id: dto.gameId}})

      /*
         if (Date.now() - new Date(game.date).getTime() > -7200000) {
          throw new HttpException("you cant add forecast now", HttpStatus.NOT_FOUND);
        }
       */
    const captainsPlayersIds = dto.captains.map(player => player.playerId)
    const captainsFormToSet = {}

    const lineupsPlayersIds = dto.lineups.map(player => player.playerId)
    const lineupsFormToSet = {}

    if (lineupsPlayersIds.length !== 11) {
      throw new HttpException("error with lineup", HttpStatus.BAD_REQUEST)
    }

    if (captainsPlayersIds.length !== 3) {
      throw new HttpException("error with captains", HttpStatus.BAD_REQUEST)
    }

    if (!rate) throw new HttpException("rate з вказаним айді не існує", HttpStatus.NOT_FOUND);

    const ratesCaptainsToRemove = await this.ratesCaptains_repository.find({where: {rates: rate}})
    const ratesLineUpsToRemove = await this.ratesLineups_repository.find({where: {rates: rate}})

    await this.ratesCaptains_repository.remove(ratesCaptainsToRemove)
    await this.ratesLineups_repository.remove(ratesLineUpsToRemove)

    rate.formation = dto.formation
    rate.passes = dto.passes
    rate.successPasses = dto.successPasses
    rate.shots = dto.shots
    rate.successShots = dto.successShots
    rate.dribbles = dto.dribbles
    rate.successDribbles = dto.successDribbles
    rate.ballAccuracy = dto.ballAccuracy

    const saveRate = await this.rates_repository.save(rate)


    // Captains
    const captainsPlayersToSet = await this.players_repository.createQueryBuilder("Player")
      .where("Player.id IN (:...id)", { id: captainsPlayersIds })
      .getMany();

    captainsPlayersToSet.forEach(player => {
      captainsFormToSet[player.id] = player
    })

    const ratesCaptainsToSave = dto.captains.map(item => {
      const newRatesCaptains = new RatesCaptains()

      newRatesCaptains.rates = rate
      newRatesCaptains.player = captainsFormToSet[item.playerId]
      newRatesCaptains.position = item.position

      return newRatesCaptains
    })


    // Lineup
    const lineupsPlayersToSet = await this.players_repository.createQueryBuilder("Player")
      .where("Player.id IN (:...id)", { id: lineupsPlayersIds })
      .getMany();

    lineupsPlayersToSet.forEach(player => {
      lineupsFormToSet[player.id] = player
    })

    const ratesLineupsToSave = dto.lineups.map(item => {
      const newRatesLineups = new RatesLineups()

      newRatesLineups.rates = rate
      newRatesLineups.player = lineupsFormToSet[item.playerId]
      newRatesLineups.role = item.position


      return newRatesLineups
    })

    const savedRatesCaptains = await this.ratesCaptains_repository.save(ratesCaptainsToSave)
    const savedRatesLineups = await this.ratesLineups_repository.save(ratesLineupsToSave)

    return {
      saveRate,
      savedRatesCaptains,
      savedRatesLineups
    }
  }

  async getRatesById(id: number) {
    const rate = await this.rates_repository.createQueryBuilder("Rates")
      .where("Rates.id = :id", {id: id})
      .leftJoinAndSelect("Rates.ratesCaptains", "ratesCaptains")
      .leftJoinAndSelect('ratesCaptains.player', 'playerCaptains') // this line
      .leftJoinAndSelect("Rates.ratesLineups", "ratesLineups")
      .leftJoinAndSelect('ratesLineups.player', 'player') // this line
      .getOne();



    const newRate = {
      ...rate,
      ratesLineups: rate.ratesLineups.map(item => {
        return {
          role: item.role,
          id: item.player.id
        }
      }),
      ratesCaptains: rate.ratesCaptains.map(item => {
        return {
          position: item.position,
          id: item.player.id
        }
      }),

    }

    return {
      rate: newRate
    }
  }

}
