import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Trophy} from "../entities/trophy.entity";

@Injectable()
export class TrophyService {

  constructor(@InjectRepository(Trophy) private trophy_repository: Repository<Trophy>) {
  }

  async addTrophy(dto, file) {
    if (!file) {
      throw new HttpException('Please add image', HttpStatus.BAD_REQUEST);
    }

    const newTrophy = new Trophy()
    newTrophy.title = dto.title
    newTrophy.date = new Date(dto.date)
    newTrophy.coach = dto.coach
    newTrophy.image = file.path.substr(7, file.path.length);

    const savedTrophy = await this.trophy_repository.save(newTrophy)

    return {
      savedTrophy
    }
  }

  async editTrophy(dto, file) {
    const trophy = await this.trophy_repository.findOne({where: {id: dto.id}})
    if (!trophy) {
      throw new HttpException('trophy not found', HttpStatus.BAD_REQUEST);
    }

    trophy.title = dto.title
    trophy.date = new Date(dto.date)
    trophy.coach = dto.coach

    if (file) {
      trophy.image = file.path.substr(7, file.path.length);
    }

    const savedTrophy = await this.trophy_repository.save(trophy)

    return {
      savedTrophy
    }
  }


  async removeTrophy(id) {
    const trophy = await this.trophy_repository.findOne({where: {id: id}})
    if (!trophy) {
      throw new HttpException('trophy not found', HttpStatus.BAD_REQUEST);
    }

    await this.trophy_repository.remove(trophy)

    return {
      message: "success removed"
    }
  }

  async getTrophies(page) {
    const trophies = await this.trophy_repository.createQueryBuilder("Trophy")
      .skip(page * 18)
      .take(18)
      .orderBy('date', 'DESC')
      .getMany();

    const length = await this.trophy_repository.count()

    return {
      data: trophies,
      length
    }
  }

  async getTrophy(id) {
    const trophy = await this.trophy_repository.findOne({where: {id: id}})
    if (!trophy) {
      throw new HttpException('trophy not found', HttpStatus.BAD_REQUEST);
    }


    return {
      trophy: trophy
    }
  }


}
