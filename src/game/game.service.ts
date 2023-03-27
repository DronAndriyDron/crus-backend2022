import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {editPlayersStatus} from 'src/dto/editPlayersStatus.dto';
import {GetGamesDto} from 'src/dto/getGames.dto';
import {Games} from 'src/entities/games.entity';
import {Players} from 'src/entities/players.entity';
import {Rates} from 'src/entities/rates.entity';
import {Ratings} from 'src/entities/ratings.entity';
import {Seasons} from 'src/entities/seasons.entity';
import {Repository} from 'typeorm';
import {updateGamesBySeasonDto} from "../dto/updateGamesBySeason.dto";
import {addNextGameDto} from "../dto/addNextGame.dto";
import {addGamesStatsDto} from "../dto/addGamesStatsDto";
import {GameLineups} from "../entities/gameLineups.entity";
import {getGameByUserDto} from "../dto/getGameByUser.dto";
import {getGameByIdDto} from "../dto/getGameById.dto";
import {getRateStatsPoints} from "../helpers/get-rate-stats-points";
import {isInt} from "class-validator";
import {getResultByRatesToGameHelper} from "../helpers/get-result-by-rates-to-game.helper";
import {Users} from "../entities/user.entity";
import {ShopElement} from "../entities/shopElement.entity";
import {PlayerStatus} from "../entities/playerStatus.entity";
import {sortByValue} from "../helpers/sort-by-value.helper";
import {UserRating} from "../entities/user-rating.entity";
const axios = require('axios');

@Injectable()
export class GameService {

  constructor(
    @InjectRepository(Seasons) private seasons_repository: Repository<Seasons>,
    @InjectRepository(Games) private games_repository: Repository<Games>,
    @InjectRepository(Rates) private rates_repository: Repository<Rates>,
    @InjectRepository(Ratings) private rating_repository: Repository<Ratings>,
    @InjectRepository(Players) private player_repository: Repository<Players>,
    @InjectRepository(GameLineups) private gameLineups_repository: Repository<GameLineups>,
    @InjectRepository(Users) private users_repository: Repository<Users>,
    @InjectRepository(ShopElement) private shopElement_repository: Repository<ShopElement>,
    @InjectRepository(PlayerStatus) private playerStatuses_repository: Repository<PlayerStatus>,
    @InjectRepository(Users) private user_repository: Repository<Users>,
    @InjectRepository(UserRating) private userRating_repository: Repository<UserRating>,
  ) {
  }

  async editStatuses(dto: editPlayersStatus) {
    const game = await this.games_repository.findOne({where: {id: dto.gameId}})
    if (!game) {
      throw new HttpException("Game not exist", HttpStatus.NOT_FOUND)
    }

    // Remove old statuses
    const oldStatuses = await this.playerStatuses_repository.find({where: {game: game}})
    await this.playerStatuses_repository.remove(oldStatuses)

    // Find players
    const playerIds = dto.statuses.map(item => item.playerId)

    let savedStatuses = []
    if (playerIds.length) {
      const players = await this.player_repository.createQueryBuilder('Player')
          .where("Player.id IN (:...ids)", {ids: playerIds})
          .getMany();
      const playerForm = {}
      players.map(player => {
        playerForm[player.id] = player
      })

      // Add new statuses
      const newStatuses = dto.statuses.map(item => {
        const newStatus = new PlayerStatus()

        newStatus.player = playerForm[item.playerId]
        newStatus.status = item.status
        newStatus.game = game

        return newStatus
      })

      savedStatuses = await this.playerStatuses_repository.save(newStatuses)
    }



    return {
      savedStatuses: savedStatuses
    }
  }


  async getPlayersAndStatuses(dto) {
    const game = await this.games_repository.findOne({where: {id: dto.gameId}});
    const user = await this.users_repository.findOne({where: {id: dto.userId}})

    if (!game) {
      throw new HttpException("Game not exist", HttpStatus.NOT_FOUND);
    }

    const playersStatuses = await this.playerStatuses_repository.createQueryBuilder("Status")
      .where("Status.game.id = :gameId", {gameId: game.id})
      .leftJoinAndSelect("Status.game", "Game")
      .leftJoinAndSelect("Status.player", "Player")
      .getMany()
    const playersStatusesForm = {}
    playersStatuses.map(item => {
      playersStatusesForm[item.id] = item
    })

    const players = await this.player_repository.find({where: {isInClub: true}})

    const transformedPlayers: Record<string, any> = players.map(item => {
      let newItem = {}

      if (playersStatusesForm[item.id]) {
        newItem = {
          ...item,
          status: playersStatusesForm[item.id].status
        }
      } else {
        newItem = {
          ...item,
          status: 'ok'
        }
      }

      return newItem
    })

    // ShopElements
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.id IN (:...ids)", {ids: elementsIds})
      .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })


    return {
      players: transformedPlayers,
      shopElements
    }
  }


  async getLastGame(dto) {
    const season = await this.seasons_repository.findOne({where: {name: dto.season}})

    const games = await this.games_repository.find({
      select: ['id', 'away', 'home', 'date', 'status', 'date', 'homeAvatar', 'awayAvatar', 'stadium', 'round', 'league', 'fixture', 'homeScore', 'awayScore', 'homeId', 'awayId'],
      where: {
        season: {
          id: season.id
        }
      },
      order: {
        date: 'DESC'
      },
      take: 1
    })

    if (games.length === 0) {
      return {
        game: null,
        isEnd: true
      }
    }

    return {
      game: games[0],
      isEnd: isInt(games[0].homeScore),
    }
  }

  async getGameByUser(dto: getGameByUserDto) {
    const gameResult = {
      ratings: {},
      gameStatsMaxValues: {
        minutes: 0,
        rating: 0,
        goals: 0,
        shotsTotal: 0,
        shotsOnGoal: 0,
        passesTotal: 0,
        passesAccuracy: 0,
        passesKey: 0,
        dribblesTotal: 0,
        dribblesSuccess: 0,
        foulCommitted: 0,
        foulDrawn: 0,
        offsides: 0,
        yellowCars: 0,
        redCards: 0
      },
      stats: {
        homeId: 0,
        id: 0,
        home: '',
        away: '',
        status: '',
        league: '',
        round: '',
        date: '',
        timezone: '',
        city: '',
        stadium: '',
        homeAvatar: '',
        awayAvatar: '',
        homeScore: 0,
        awayScore: 0,
        formation: '',
        homeShotsOnGoal: 0,
        homeShotsTotal: 0,
        homeBlockShots: 0,
        homeShotsInsideBox: 0,
        homeShotsOutsideBox: 0,
        homeFouls: 0,
        homeCorners: 0,
        homeOffsides: 0,
        homeBallPossession: 0,
        homeSaves: 0,
        homePassesTotal: 0,
        homePassesAccurate: 0,
        homeYellowCard: 0,
        homeRedCard: 0,
        awayShotsOnGoal: 0,
        awayShotsTotal: 0,
        awayBlockShots: 0,
        awayShotsInsideBox: 0,
        awayShotsOutsideBox: 0,
        awayFouls: 0,
        awayCorners: 0,
        awayOffsides: 0,
        awayBallPossession: 0,
        awaySaves: 0,
        awayPassesTotal: 0,
        awayPassesAccurate: 0,
        awayYellowCard: 0,
        awayRedCard: 0,
      },
      lineup: {},
      isGameEnd: false
    }


    const rateResult = {
      captains: {},
      stats: {},
      statsResult: {
        shoots: {
          title: 'shots',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 0,
          zone2: 1,
          zone3: 3
        },
        successShots: {
          title: 'shots_on_target',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 0,
          zone2: 1,
          zone3: 2
        },
        passes: {
          title: 'passes',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 10,
          zone2: 20,
          zone3: 50
        },
        successPasses: {
          title: 'success_passes',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 10,
          zone2: 20,
          zone3: 30
        },
        dribbles: {
          title: 'dribbles',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 0,
          zone2: 1,
          zone3: 3
        },
        successDribbles: {
          title: 'success_dribbles',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 0,
          zone2: 1,
          zone3: 2
        },
        ballAccuracy: {
          title: 'ball_accuracy',
          rateValue: 0,
          gameValue: 0,
          points: 0,
          zone1: 1,
          zone2: 3,
          zone3: 5
        },
      },
      lineup: {},
      isFormationTrue: true
    }

    let lineupsPoints: any = 0
    let captainsPoints: any = 0
    let gamePoints: any = 0


    const game = await this.games_repository.createQueryBuilder("Game")
      .where("Game.id = :id", {id: dto.gameId})
      .leftJoinAndSelect('Game.rate', 'Rate', "Rate.game = :gameId AND Rate.user = :userId", {
        gameId: dto.gameId,
        userId: dto.userId
      })
      .leftJoinAndSelect("Game.rating", "GameRatings")
      .leftJoinAndSelect("GameRatings.player", "RatingsPlayers")
      .leftJoinAndSelect("Rate.ratesLineups", "RateLineups")
      .leftJoinAndSelect("Rate.ratesCaptains", "RateCaptains")
      .leftJoinAndSelect("RateLineups.player", "RatesLineupsPlayers")
      .leftJoinAndSelect("RateCaptains.player", "CaptainsPlayers")
      .getOne();

    if (!game) {
      throw new HttpException("game not found", HttpStatus.NOT_FOUND);
    }


    gameResult.stats = {
      homeId: game.homeId,
      id: game.id,
      home: game.home,
      away: game.away,
      status: game.status,
      league: game.league,
      round: game.round,
      date: game.date,
      timezone: game.timezone,
      city: game.city,
      stadium: game.stadium,
      homeAvatar: game.homeAvatar,
      awayAvatar: game.awayAvatar,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      formation: game.formation,
      homeShotsOnGoal: game.homeShotsOnGoal,
      homeShotsTotal: game.homeShotsTotal,
      homeBlockShots: game.homeBlockShots,
      homeShotsInsideBox: game.homeShotsInsideBox,
      homeShotsOutsideBox: game.homeShotsOutsideBox,
      homeFouls: game.homeFouls,
      homeCorners: game.homeCorners,
      homeOffsides: game.homeOffsides,
      homeBallPossession: game.homeBallPossession,
      homeSaves: game.homeSaves,
      homePassesTotal: game.homePassesTotal,
      homePassesAccurate: game.homePassesAccurate,
      homeYellowCard: game.homeYellowCard,
      homeRedCard: game.homeRedCard,
      awayShotsOnGoal: game.awayShotsOnGoal,
      awayShotsTotal: game.awayShotsTotal,
      awayBlockShots: game.awayBlockShots,
      awayShotsInsideBox: game.awayShotsInsideBox,
      awayShotsOutsideBox: game.awayShotsOutsideBox,
      awayFouls: game.awayFouls,
      awayCorners: game.awayCorners,
      awayOffsides: game.awayOffsides,
      awayBallPossession: game.awayBallPossession,
      awaySaves: game.awaySaves,
      awayPassesTotal: game.awayPassesTotal,
      awayPassesAccurate: game.awayPassesAccurate,
      awayYellowCard: game.awayYellowCard,
      awayRedCard: game.awayRedCard,

    }

    if (Number.isInteger(game.homeScore)) {
      gameResult.isGameEnd = true

      const gameLineup = await this.games_repository.createQueryBuilder("Game")
        .where("Game.id = :id", {id: dto.gameId})
        .leftJoinAndSelect("Game.gameLineups", "GameLineup")
        .leftJoinAndSelect("GameLineup.player", "LineupsPlayer")
        .getOne();

      //Game Ratings

      // set max values
      game.rating.forEach(item => {
        Object.keys(gameResult.gameStatsMaxValues).forEach(key => {
          if (item[key] > gameResult.gameStatsMaxValues[key]) {
            gameResult.gameStatsMaxValues[key] = item[key]
          }
        })


        gameResult.ratings[item.player.id] = {
          id: item.player.id,
          name: item.player.name,
          surname: item.player.surname,
          number: item.player.number,
          avatar: item.player.image,
          position: item.player.position,
          minutes: item.minutes,
          rating: item.rating * 1,
          goals: item.goals,
          shotsTotal: item.shotsTotal,
          shotsOnGoal: item.shotsOnGoal,
          passesTotal: item.passesTotal,
          passesAccuracy: item.passesAccuracy,
          passesKey: item.passesKey,
          dribblesTotal: item.dribblesTotal,
          dribblesSuccess: item.dribblesSuccess,
          foulCommitted: item.foulCommitted,
          foulDrawn: item.foulDrawn,
          offsides: item.offsides,
          yellowCars: item.yellowCards,
          redCards: item.redCards,
          statistics: {
            minutes: item.minutes,
            rating: item.rating * 1,
            goals: item.goals,
            shotsTotal: item.shotsTotal,
            shotsOnGoal: item.shotsOnGoal,
            passesTotal: item.passesTotal,
            passesAccuracy: item.passesAccuracy,
            passesKey: item.passesKey,
            dribblesTotal: item.dribblesTotal,
            dribblesSuccess: item.dribblesSuccess,
            foulCommitted: item.foulCommitted,
            foulDrawn: item.foulDrawn,
            offsides: item.offsides,
            yellowCars: item.yellowCards,
            redCards: item.redCards
          }
        }
      })


      // GameLineups
      gameLineup.gameLineups.forEach(item => {
        gameResult.lineup[item.role] = {
          id: item.player.id,
          name: item.player.name,
          surname: item.player.surname,
          number: item.player.number,
          avatar: item.player.image,
          position: item.player.position,
          role: item.role,
          rating: gameResult.ratings[item.player.id]?.rating
        }
      })
    }

    if (game.rate.length) {
      rateResult.stats = {
        id: game.rate[0].id,
        shots: game.rate[0].shots,
        successShots: game.rate[0].successShots,
        passes: game.rate[0].passes,
        successPasses: game.rate[0].successPasses,
        dribbles: game.rate[0].dribbles,
        successDribbles: game.rate[0].successDribbles,
        ballAccuracy: game.rate[0].ballAccuracy,
        formation: game.rate[0].formation
      }


      //RateLineups
      game.rate[0].ratesLineups.forEach(item => {
        rateResult.lineup[item.role] = {
          id: item.player.id,
          name: item.player.name,
          surname: item.player.surname,
          number: item.player.number,
          avatar: item.player.image,
          position: item.player.position,
          role: item.role
        }
      })


      game.rate[0].ratesCaptains.forEach(item => {
        rateResult.captains[item.position] = {
          id: item.player.id,
          name: item.player.name,
          surname: item.player.surname,
          number: item.player.number,
          avatar: item.player.image,
          position: item.position,
        }
      })


    }

    if (game.rate.length && Number.isInteger(game.homeScore)) {
      const isHome = process.env.TEAM_ID === game.homeId.toString()

      rateResult.statsResult.shoots.rateValue = game.rate[0].shots
      rateResult.statsResult.shoots.gameValue = isHome ? gameResult.stats.homeShotsTotal : gameResult.stats.awayShotsTotal
      rateResult.statsResult.shoots.points = getRateStatsPoints(
        game.rate[0].shots,
        gameResult.stats.awayShotsTotal,
        rateResult.statsResult.shoots.zone1,
        rateResult.statsResult.shoots.zone2,
        rateResult.statsResult.shoots.zone3,
      )

      rateResult.statsResult.successShots.rateValue = game.rate[0].successShots
      rateResult.statsResult.successShots.gameValue = isHome ? gameResult.stats.homeShotsOnGoal : gameResult.stats.awayShotsOnGoal
      rateResult.statsResult.successShots.points = getRateStatsPoints(
        game.rate[0].successShots,
        gameResult.stats.awayShotsOnGoal,
        rateResult.statsResult.successShots.zone1,
        rateResult.statsResult.successShots.zone2,
        rateResult.statsResult.successShots.zone3,
      )

      rateResult.statsResult.passes.rateValue = game.rate[0].passes
      rateResult.statsResult.passes.gameValue = isHome ? gameResult.stats.homePassesTotal : gameResult.stats.awayPassesTotal
      rateResult.statsResult.passes.points = getRateStatsPoints(
        game.rate[0].passes,
        gameResult.stats.awayPassesTotal,
        rateResult.statsResult.passes.zone1,
        rateResult.statsResult.passes.zone2,
        rateResult.statsResult.passes.zone3,
      )

      rateResult.statsResult.successPasses.rateValue = game.rate[0].successPasses
      rateResult.statsResult.successPasses.gameValue = isHome ? gameResult.stats.homePassesAccurate : gameResult.stats.awayPassesAccurate
      rateResult.statsResult.successPasses.points = getRateStatsPoints(
        game.rate[0].successPasses,
        gameResult.stats.awayPassesAccurate,
        rateResult.statsResult.successPasses.zone1,
        rateResult.statsResult.successPasses.zone2,
        rateResult.statsResult.successPasses.zone3,
      )

      rateResult.statsResult.ballAccuracy.rateValue = game.rate[0].ballAccuracy
      rateResult.statsResult.ballAccuracy.gameValue = isHome ? gameResult.stats.homeBallPossession : gameResult.stats.awayBallPossession
      rateResult.statsResult.ballAccuracy.points = getRateStatsPoints(
        game.rate[0].ballAccuracy,
        gameResult.stats.awayBallPossession,
        rateResult.statsResult.ballAccuracy.zone1,
        rateResult.statsResult.ballAccuracy.zone2,
        rateResult.statsResult.ballAccuracy.zone3,
      )

      //Rate result Dribbles
      let gameDribbles = 0
      let gameSuccessDribbles = 0

      Object.keys(gameResult.ratings).forEach(key => {
        if (gameResult.ratings[key].dribblesTotal) {
          gameDribbles = gameDribbles + gameResult.ratings[key].dribblesTotal
        }
      })

      Object.keys(gameResult.ratings).forEach(key => {
        if (gameResult.ratings[key].dribblesSuccess) {
          gameSuccessDribbles = gameSuccessDribbles + gameResult.ratings[key].dribblesSuccess
        }
      })

      rateResult.statsResult.dribbles.rateValue = game.rate[0].dribbles
      rateResult.statsResult.dribbles.gameValue = gameDribbles
      rateResult.statsResult.dribbles.points = getRateStatsPoints(
        game.rate[0].dribbles,
        gameDribbles,
        rateResult.statsResult.dribbles.zone1,
        rateResult.statsResult.dribbles.zone2,
        rateResult.statsResult.dribbles.zone3,
      )

      rateResult.statsResult.successDribbles.rateValue = game.rate[0].successDribbles
      rateResult.statsResult.successDribbles.gameValue = gameSuccessDribbles
      rateResult.statsResult.successDribbles.points = getRateStatsPoints(
        game.rate[0].successDribbles,
        gameSuccessDribbles,
        rateResult.statsResult.successDribbles.zone1,
        rateResult.statsResult.successDribbles.zone2,
        rateResult.statsResult.successDribbles.zone3,
      )

      //Rate result ( Points )
      Object.keys(rateResult.statsResult).forEach(item => {
        gamePoints = gamePoints + rateResult.statsResult[item].points
      })

      //Rate result ( Captains )
      Object.keys(rateResult.captains).forEach(key => {
        if (gameResult.ratings[rateResult.captains[key].id]?.rating) {
          rateResult.captains[rateResult.captains[key].position].rating = gameResult.ratings[rateResult.captains[key]?.id].rating
        }
      })

      Object.keys(rateResult.captains).forEach(key => {
        if (rateResult.captains[key].rating) {
          captainsPoints = captainsPoints + rateResult.captains[key].rating
        }
      })

      //@ts-ignore
      rateResult.isFormationTrue = rateResult.stats.formation === game.formation

      if (rateResult.isFormationTrue) {
        //Rate result ( Lineup )
        !!Object.keys(rateResult.lineup).length && Object.keys(rateResult.lineup).forEach(key => {
          if (rateResult.lineup[key].id === gameResult.lineup[key].id) {
            lineupsPoints = lineupsPoints + 1
            rateResult.lineup[key].isTrue = true
          }
        })
      }
    }


    captainsPoints = captainsPoints.toFixed(1)
    captainsPoints = captainsPoints * 1
    gamePoints = gamePoints.toFixed(1)
    gamePoints = gamePoints * 1

    const playersStatuses = await this.playerStatuses_repository.createQueryBuilder("Status")
      .where("Status.game.id = :gameId", {gameId: game.id})
      .leftJoinAndSelect("Status.player", "Player")
      .getMany()
    const playersStatusesIds = playersStatuses.map(item => item.player.id)
    const players = await this.player_repository.find({where: {isInClub: true}})
    const playersToReturn = players.filter(player => !playersStatusesIds.includes(player.id))


    // ShopElements
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.id IN (:...ids)", {ids: elementsIds})
      .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })

    return {
      lineupsPoints,
      captainsPoints,
      gamePoints,
      rateResult,
      gameResult,
      players: playersToReturn,
      game,
      shopElements: shopElements
    }
  }

  async getGameById(dto: getGameByIdDto) {
    const isHaveGame = await this.games_repository.count({where: {id: dto.gameId}})

    if (!isHaveGame) {
      throw new HttpException("Game not found used", HttpStatus.BAD_REQUEST)
    }

    const gameResult = {
      isGameEnd: false,
      stats: {},
      ratings: {},
      lineup: {},
      gameStatsMaxValues: {
        minutes: 0,
        rating: 0,
        goals: 0,
        shotsTotal: 0,
        shotsOnGoal: 0,
        passesTotal: 0,
        passesAccuracy: 0,
        passesKey: 0,
        dribblesTotal: 0,
        dribblesSuccess: 0,
        foulCommitted: 0,
        foulDrawn: 0,
        offsides: 0,
        yellowCars: 0,
        redCards: 0
      }
    }

    const game = await this.games_repository.createQueryBuilder("Game")
      .where("Game.id = :id", {id: dto.gameId})
      .leftJoinAndSelect("Game.gameLineups", "GameLineup")
      .leftJoinAndSelect("Game.rating", "GameRatings")
      .leftJoinAndSelect("GameRatings.player", "RatingPlayer")
      .leftJoinAndSelect("GameLineup.player", "LineupPlayer")
      .getOne()

    if (!game) {
      throw new HttpException("game not found", HttpStatus.NOT_FOUND);
    }


    gameResult.stats = {
      id: game.id,
      fixture: game.fixture,
      home: game.home,
      away: game.away,
      status: game.status,
      league: game.league,
      round: game.round,
      date: game.date,
      timezone: game.timezone,
      city: game.city,
      stadium: game.stadium,
      homeAvatar: game.homeAvatar,
      awayAvatar: game.awayAvatar,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      formation: game.formation,
      homeShotsOnGoal: game.homeShotsOnGoal,
      homeShotsTotal: game.homeShotsTotal,
      homeBlockShots: game.homeBlockShots,
      homeShotsInsideBox: game.homeShotsInsideBox,
      homeShotsOutsideBox: game.homeShotsOutsideBox,
      homeFouls: game.homeFouls,
      homeCorners: game.homeCorners,
      homeOffsides: game.homeOffsides,
      homeBallPossession: game.homeBallPossession,
      homeSaves: game.homeSaves,
      homePassesTotal: game.homePassesTotal,
      homePassesAccurate: game.homePassesAccurate,
      homeYellowCard: game.homeYellowCard,
      homeRedCard: game.homeRedCard,
      awayShotsOnGoal: game.awayShotsOnGoal,
      awayShotsTotal: game.awayShotsTotal,
      awayBlockShots: game.awayBlockShots,
      awayShotsInsideBox: game.awayShotsInsideBox,
      awayShotsOutsideBox: game.awayShotsOutsideBox,
      awayFouls: game.awayFouls,
      awayCorners: game.awayCorners,
      awayOffsides: game.awayOffsides,
      awayBallPossession: game.awayBallPossession,
      awaySaves: game.awaySaves,
      awayPassesTotal: game.awayPassesTotal,
      awayPassesAccurate: game.awayPassesAccurate,
      awayYellowCard: game.awayYellowCard,
      awayRedCard: game.awayRedCard,
    }


    if (Number.isInteger(game.homeScore)) {
      gameResult.isGameEnd = true

      //Game Ratings

      // set max values
      game.rating.forEach(item => {
        Object.keys(gameResult.gameStatsMaxValues).forEach(key => {
          if (item[key] > gameResult.gameStatsMaxValues[key]) {
            gameResult.gameStatsMaxValues[key] = item[key]
          }
        })
      })

      gameResult.ratings = game.rating.map(item => {
        return {
          ...item.player,
          statistics: {
            minutes: item.minutes,
            rating: item.rating * 1,
            goals: item.goals,
            shotsTotal: item.shotsTotal,
            shotsOnGoal: item.shotsOnGoal,
            passesTotal: item.passesTotal,
            passesAccuracy: item.passesAccuracy,
            passesKey: item.passesKey,
            dribblesTotal: item.dribblesTotal,
            dribblesSuccess: item.dribblesSuccess,
            foulCommitted: item.foulCommitted,
            foulDrawn: item.foulDrawn,
            offsides: item.offsides,
            yellowCars: item.yellowCards,
            redCards: item.redCards
          }
        }
      })

      // GameLineups
      game.gameLineups.forEach(item => {
        gameResult.lineup[item.role] = {
          id: item.player.id,
          name: item.player.name,
          surname: item.player.surname,
          number: item.player.number,
          avatar: item.player.image,
          position: item.player.position,
          role: item.role,
          rating: gameResult.ratings[item.player.id]?.rating
        }
      })
    }

    const playersStatuses = await this.playerStatuses_repository.createQueryBuilder("Status")
      .where("Status.game.id = :gameId", {gameId: game.id})
      .leftJoinAndSelect("Status.player", "Player")
      .getMany()
    const playersStatusesIds = playersStatuses.map(item => item.player.id)
    const players = await this.player_repository.find({where: {isInClub: true}})
    const playersToReturn = players.filter(player => !playersStatusesIds.includes(player.id))

    // ShopElements
    const user = await this.users_repository.findOne({where: {id: dto.userId}})
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.id IN (:...ids)", {ids: elementsIds})
      .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })


    return {
      gameResult,
      players: playersToReturn,
      shopElements: shopElements
    }
  }

  async updateGamesBySeason(dto: updateGamesBySeasonDto) {

    const season = await this.seasons_repository.findOne({where: {name: dto.season}})
    if (!season) {
      throw new HttpException("this season not exist", HttpStatus.NOT_FOUND)
    }

    const allGames = await this.games_repository.find()
    const allGamesFixturesIds = allGames.map(item => item.fixture)

    const config = {
      method: 'get',
      url: `https://v3.football.api-sports.io/fixtures?team=${process.env.TEAM_ID}&season=${dto.season}`,
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    const gamesToAdd = await axios(config)
      .then(response => {
        return response.data.response
      })
      .then(result => {
        const filteredData = result.filter(game => {
          return !allGamesFixturesIds.includes(game.fixture.id) && game.fixture.status.long.toLowerCase() === 'match finished'
        })


        return filteredData.map(game => {
          const pre_saved_data = new Games()

          pre_saved_data.status = game.fixture.status.long
          pre_saved_data.league = game.league.name
          pre_saved_data.round = game.league.round
          pre_saved_data.home = game.teams.home.name
          pre_saved_data.away = game.teams.away.name
          pre_saved_data.homeId = game.teams.home.id
          pre_saved_data.awayId = game.teams.away.id
          pre_saved_data.homeAvatar = game.teams.home.logo
          pre_saved_data.awayAvatar = game.teams.away.logo
          pre_saved_data.date = game.fixture.date
          pre_saved_data.timezone = game.fixture.timezone
          pre_saved_data.city = game.fixture.venue.city ? game.fixture.venue.city : ''
          pre_saved_data.stadium = game.fixture.venue.name ? game.fixture.venue.name : ''
          pre_saved_data.fixture = game.fixture.id
          pre_saved_data.season = season


          return pre_saved_data
        })
      })

    const savedData = await this.games_repository.save(gamesToAdd)

    return {savedData: savedData}
  }

  async addNextGame(dto: addNextGameDto) {
    const season = await this.seasons_repository.findOne({where: {name: dto.season}})

    if (!season) {
      throw new HttpException("not found neither season", HttpStatus.NOT_FOUND);
    }
        const pre_saved_data = new Games()

        pre_saved_data.status = dto.status
        pre_saved_data.league = dto.league
        pre_saved_data.round = dto.round
        pre_saved_data.home = dto.home
        pre_saved_data.away = dto.away
        pre_saved_data.homeId = dto.homeId
        pre_saved_data.awayId = dto.awayId
        pre_saved_data.homeAvatar = dto.homeAvatar
        pre_saved_data.awayAvatar = dto.awayAvatar
        pre_saved_data.date = dto.date
        pre_saved_data.timezone = dto.timezone
        pre_saved_data.city = dto.city
        pre_saved_data.stadium = dto.stadium
        pre_saved_data.fixture = dto.fixture
        pre_saved_data.season = season



    const isHaveFixture = await this.games_repository.find({where: {fixture: pre_saved_data.fixture}})

    if (isHaveFixture.length) {
      throw new HttpException("We have this issue", HttpStatus.BAD_REQUEST);
    }

    const savedData = await this.games_repository.save(pre_saved_data)


    return {
      savedData,
    }
  }

  async getGames(dto: GetGamesDto): Promise<Record<string, any>> {
    const season = await this.seasons_repository.findOne({where: {name: dto.season}});

    if (!season) {
      throw new HttpException("not found neither season", HttpStatus.NOT_FOUND);
    }

    const games = await this.games_repository.find({
      select: ['id', 'away', 'home', 'date', 'status', 'date', 'homeAvatar', 'awayAvatar', 'stadium', 'round', 'league', 'fixture', 'homeScore', 'awayScore', 'homeId', 'awayId'],
      where: {
        season: {
          id: season.id
        }
      },
      order: {
        date: 'DESC'
      },
      skip: dto.page * 16,
      take: 16
    })

    const length = await this.games_repository.count({
      where: {
        season: {
          id: season.id
        }
      }
    })

    return {
      games,
      length
    };
  }


  async getClubStats(season: string) {
    const seasonData = await this.seasons_repository.findOne({name: season})
    if (!seasonData) {
      return new HttpException("not found neither season", HttpStatus.NOT_FOUND);
    }

    const data = await this.games_repository.createQueryBuilder("Game")
      .where("Game.season = :season", {season: seasonData.id})
      .andWhere("Game.homeScore IS NOT NULL")
      .orderBy('Game.date', 'DESC')
      .getMany();


    const players = await this.player_repository.find({where: {isInClub: true}})

    const clubShopElements = {}

    const formsData = process.env.ACTIVE_SEASON_FORM.split(',')
    const uniformData = []
    formsData.forEach((item) => {
      const splitItem: any = item.split('-')

      uniformData.push({
        role: splitItem[0] * 1,
        id: splitItem[1] * 1
      })
    })


    const clubElementsIds = uniformData.map((item: Record<string, any>) => {
      clubShopElements[item.id] = {id: item.id, role: item.role}
      return item.id
    })

    const clubElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
        .where("ShopElements.id IN (:...ids)", {ids: clubElementsIds})
        .getMany()

    clubElements.forEach((item: Record<string, any>) => {
      clubShopElements[item.id].image = item.image
    })

    // ShopElements
    const user = await this.users_repository.findOne({where: {id: 1}})
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
        .where("ShopElements.id IN (:...ids)", {ids: elementsIds})
        .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })


    return {
      data,
      shopElements,
      players,
      clubShopElements
    }
  }

  async addGameStats(dto: addGamesStatsDto) {
    const game = await this.games_repository.findOne({where: {id: dto.gameId}})
    if (!game) {
      throw new HttpException("this game not exist", HttpStatus.NOT_FOUND)
    }

    const lineupsPlayersIds = dto.lineups.map(player => player.playerId)
    const lineupsFormToSet = {}
    const ratingsPlayersIds = dto.ratings.map(player => player.id)
    const ratingsFormToSet = {}

    if (lineupsPlayersIds.length !== 11) {
      throw new HttpException("error with lineup", HttpStatus.NOT_FOUND)
    }

    if (ratingsPlayersIds.length < 11) {
      throw new HttpException("error with lineup", HttpStatus.NOT_FOUND)
    }


    // add stats
    game.homeScore = dto.homeScore
    game.formation = dto.formation
    game.homeShotsOnGoal = dto.homeShotsOnGoal
    game.homeShotsTotal = dto.homeShotsTotal
    game.homeBlockShots = dto.homeBlockShots
    game.homeShotsInsideBox = dto.homeShotsInsideBox
    game.homeShotsOutsideBox = dto.homeShotsOutsideBox
    game.homeFouls = dto.homeFouls
    game.homeCorners = dto.homeCorners
    game.homeOffsides = dto.homeOffsides
    game.homeBallPossession = dto.homeBallPossession
    game.homeSaves = dto.homeSaves
    game.homePassesTotal = dto.homePassesTotal
    game.homePassesAccurate = dto.homePassesAccurate
    game.homeYellowCard = dto.homeYellowCard
    game.homeRedCard = dto.homeRedCard
    game.awayScore = dto.awayScore
    game.awayShotsOnGoal = dto.awayShotsOnGoal
    game.awayShotsTotal = dto.awayShotsTotal
    game.awayBlockShots = dto.awayBlockShots
    game.awayShotsInsideBox = dto.awayShotsInsideBox
    game.awayShotsOutsideBox = dto.awayShotsOutsideBox
    game.awayFouls = dto.awayFouls
    game.awayCorners = dto.awayCorners
    game.awayOffsides = dto.awayOffsides
    game.awayBallPossession = dto.awayBallPossession
    game.awaySaves = dto.awaySaves
    game.awayPassesTotal = dto.awayPassesTotal
    game.awayPassesAccurate = dto.awayPassesAccurate
    game.awayYellowCard = dto.awayYellowCard
    game.awayRedCard = dto.awayRedCard

    const savedGame = await this.games_repository.save(game)


    // add lineup
    const lineupsPlayersToSet = await this.player_repository.createQueryBuilder("Player")
      .where("Player.id IN (:...id)", {id: [...lineupsPlayersIds]})
      .getMany();
    lineupsPlayersToSet.forEach(player => {
      lineupsFormToSet[player.id] = player
    })
    const lineupsToSave = dto.lineups.map(item => {
      const newRatesLineups = new GameLineups()

      newRatesLineups.game = savedGame
      newRatesLineups.player = lineupsFormToSet[item.playerId]
      newRatesLineups.role = item.role

      return newRatesLineups
    })


    // Set ratings
    const ratingsPlayersToSet = await this.player_repository.createQueryBuilder("Player")
      .where("Player.id IN (:...id)", {id: ratingsPlayersIds})
      .getMany();
    ratingsPlayersToSet.forEach(player => {
      ratingsFormToSet[player.id] = player
    })
    const ratingsToSave = dto.ratings.map(item => {
      const newRatesLineups = new Ratings()

      newRatesLineups.game = savedGame
      newRatesLineups.minutes = item.minutes
      newRatesLineups.rating = item.rating
      newRatesLineups.goals = item.goals
      newRatesLineups.shotsTotal = item.shotsTotal
      newRatesLineups.shotsOnGoal = item.shotsOnGoal
      newRatesLineups.passesTotal = item.passesTotal
      newRatesLineups.passesAccuracy = item.passesAccuracy
      newRatesLineups.passesKey = item.passesKey
      newRatesLineups.dribblesTotal = item.dribblesTotal
      newRatesLineups.dribblesSuccess = item.dribblesSuccess
      newRatesLineups.foulCommitted = item.foulCommitted
      newRatesLineups.foulDrawn = item.foulDrawn
      newRatesLineups.offsides = item.offsides
      newRatesLineups.yellowCards = item.yellowCars
      newRatesLineups.redCards = item.redCards
      newRatesLineups.assists = 0
      newRatesLineups.player = ratingsFormToSet[item.id]

      return newRatesLineups
    })

    const savedGameRatings = await this.rating_repository.save(ratingsToSave)
    const savedGameLineups = await this.gameLineups_repository.save(lineupsToSave)


    // Add exp and coins
    const usersCoinsForm: Record<string, any> = {}
    const allRates = await this.rates_repository.createQueryBuilder('Rate')
      .where('Rate.game.id = :game', {game: savedGame.id})
      .leftJoinAndSelect('Rate.user', 'User')
      .leftJoinAndSelect("Rate.ratesLineups", "RateLineups")
      .leftJoinAndSelect("Rate.ratesCaptains", "RateCaptains")
      .leftJoinAndSelect("RateLineups.player", "LineupsPlayers")
      .leftJoinAndSelect("RateCaptains.player", "CaptainsPlayers")
      .getMany();


    allRates.forEach(item => {
      const res = getResultByRatesToGameHelper({
        rateStats: item,
        gameStats: {...savedGame, gameLineups: savedGameLineups, rating: savedGameRatings},
        isHome: savedGame.homeId.toString() === process.env.TEAM_ID
      })

      usersCoinsForm[item.user.id] = {
        id: item.user.id,
        ...res
      }
    })


    const userIds = Object.values(usersCoinsForm).map(item => item.id)
    const usersToUpdate = userIds.length ? await this.users_repository.createQueryBuilder('User')
      .where("User.id IN (:...ids)", {ids: userIds})
      .getMany() : []


    const usersToSave = usersToUpdate.map((item) => {
      const newCoinsValue = item.coins + usersCoinsForm[item.id.toString()].coins
      const newPointsValue = item.experience * 1 + usersCoinsForm[item.id.toString()].points

      item.coins = newCoinsValue
      item.experience = newPointsValue

      return item
    })

    const savedUsers = await this.users_repository.save(usersToSave)


    // User ratings
    await this.setUsersList();

    return {
      savedGame,
      savedGameLineups,
      savedGameRatings,
      savedUsers
    }
  }


  async setUsersList() {
    const oldList = await this.userRating_repository.find()
    await this.userRating_repository.remove(oldList)

    const allUsers = await this.user_repository
        .createQueryBuilder('User')
        .leftJoinAndSelect('User.rates', 'Rate')
        .leftJoinAndSelect('Rate.game', 'Game')
        .leftJoinAndSelect('Rate.ratesLineups', 'GameLineup')
        .leftJoinAndSelect('Rate.ratesCaptains', 'GameRatings')
        .leftJoinAndSelect('GameRatings.player', 'RatingPlayer')
        .leftJoinAndSelect('GameLineup.player', 'LineupPlayer')
        .getMany();

    const allGames = await this.games_repository
        .createQueryBuilder('Game')
        .where('Game.homeScore IS NOT NULL')
        .leftJoinAndSelect('Game.season', 'GameSeason')
        .andWhere("GameSeason.name = :name", { name: `${process.env.ACTIVE_SEASON}` })
        .leftJoinAndSelect('Game.gameLineups', 'GameLineup')
        .leftJoinAndSelect('Game.rating', 'GameRatings')
        .leftJoinAndSelect('GameRatings.player', 'RatingPlayer')
        .leftJoinAndSelect('GameLineup.player', 'LineupPlayer')
        .getMany();

    const results = allUsers.map((user) => {
      const newUser = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        rating: 0,
        position: 0,
        login: user.login
      };

      user.rates.forEach((rate) => {
        const game = allGames.find((item) => item.id === rate.game.id);
        if (!game) return;

        const gameResult = getResultByRatesToGameHelper({
          rateStats: rate,
          gameStats: game,
          isHome: game.homeId.toString() === process.env.TEAM_ID,
        });

        newUser.rating = newUser.rating + gameResult.points;
      });

      return newUser;
    });

    const sorterList = sortByValue(results);

    const usersToSave = sorterList.map((user, index) => {
      const userRating = new UserRating()
      userRating.userId = user.id
      userRating.name = user.login
      userRating.points = user.rating.toFixed()
      userRating.position = index + 1

      return userRating
    })

    await this.userRating_repository.save(usersToSave)

    return {
      message: "success updated"
    };
  }



  async getPlayersCompare (id: number, season: number) {
    const data = await this.rating_repository.createQueryBuilder("Rating")
      .leftJoinAndSelect("Rating.player", "Player")
      .leftJoinAndSelect("Rating.game", "Game")
      .leftJoinAndSelect("Game.season", "Season")
      .where("Player.id = :id", {id: id})
      .andWhere("Season.name = :season", {season: season})
      .getMany()


    // ShopElements
    const user = await this.users_repository.findOne({where: {id: 1}})
    const elementsIds = [user.playerForm, user.goalkeeperForm, user.stadium]
    const shopElements = {}
    const userElements = await this.shopElement_repository.createQueryBuilder("ShopElements")
      .where("ShopElements.id IN (:...ids)", {ids: elementsIds})
      .getMany()
    userElements.forEach(item => {
      shopElements[item.type] = item.image
    })



    return {
      data,
      shopElements
    }
  }
}



