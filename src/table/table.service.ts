import {Injectable, Res} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {LaLiga} from "../entities/laliga.entity";
import {Repository} from "typeorm";
const axios = require('axios');

@Injectable()
export class TableService {
  constructor(@InjectRepository(LaLiga) private LaLiga_Repository: Repository<LaLiga>) {

  }

  async updateTable(){
    const config = {
      method: 'get',
      url: `https://v3.football.api-sports.io/standings?league=${process.env.TABLE_LIGA}&season=${process.env.ACTIVE_SEASON}` ,
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    };

    const laligaDataToSet = await axios(config)
      .then(function (response) {
        const arr = response.data.response[0].league.standings[0]
        const resultArr = []
        arr.forEach(item => {
          const teamItemToSet = {
            team: item.team.name,
            rank: item.rank,
            points: item.points,
            games: item.all.played,
            win: item.all.win,
            lose: item.all.lose,
            draw: item.all.draw,
            scoredGoals: item.all.goals.for,
            missedGoals: item.all.goals.against,
            form: item.form,
            logo: item.team.logo
          }

          resultArr.push(teamItemToSet)
        })



        const laLigaTables = resultArr.map(item => {
          const laLiga = new LaLiga()


          laLiga.team = item.team
          laLiga.rank = item.rank
          laLiga.points = item.points
          laLiga.games = item.games
          laLiga.win = item.win
          laLiga.lose = item.lose
          laLiga.draw = item.draw
          laLiga.goalsScored = item.scoredGoals
          laLiga.goalsMissed = item.missedGoals
          laLiga.form = item.form ? item.form  : ''
          laLiga.logo = item.logo

          return laLiga
        })

        return laLigaTables
      })
      .catch(function (error) {
        console.warn(error)
      });


    const removeLaLiga = await this.LaLiga_Repository.find()
    const removeLaligasIds = removeLaLiga.map(key => {
      return key.id
    })

    if (removeLaligasIds.length > 0) await this.LaLiga_Repository.delete(removeLaligasIds)

    const savedLaliga = await this.LaLiga_Repository.save(laligaDataToSet)

    return savedLaliga
  }

  async getLaLigaTableAll() {
    return await this.LaLiga_Repository.find()
  }

}
