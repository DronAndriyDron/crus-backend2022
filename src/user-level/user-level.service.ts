import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserLevel} from "../entities/userLevel.entity";

const levelsData = [
  {name: 'beginner', points: 0},
  {name: 'experienced', points: 40},
  {name: 'butcher', points: 120},
  {name: 'veteran', points: 240},
  {name: 'fan', points: 400},
  {name: 'ultras', points: 600},
  {name: 'warrior', points: 840},
  {name: 'cyborg', points: 1120},
  {name: 'leader', points: 1460},
  {name: 'gladiator', points: 1860},
  {name: 'profi', points: 2300},
  {name: 'expert', points: 2780},
  {name: 'guru', points: 3300},
  {name: 'sensei', points: 3860},
  {name: 'socios', points: 4460}]



@Injectable()
export class UserLevelService {

  constructor(
    @InjectRepository(UserLevel) private userLevel_repository: Repository<UserLevel>,
  ) {}


  async setUserLevelTable() {
    const levels = await this.userLevel_repository.find();

    if (levels.length) return {
      message: "already set"
    }

    const levelsToSave = levelsData.map((item, index) => {
      const newLevel = new UserLevel()

      newLevel.name = item.name
      newLevel.points = item.points
      newLevel.priority = index

      return newLevel
    })


    const saveLevels = await this.userLevel_repository.save(levelsToSave)

    return {
      saveLevels
    };
  }

  async getLevels () {
    const levels = await this.userLevel_repository.find()

    return {
      levels
    }
  }

}
